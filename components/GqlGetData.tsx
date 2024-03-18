import { useState, useEffect } from "react";
import { gql, useApolloClient } from "@apollo/client";
import { OrderByDirection } from "@/gql/__generated__/graphql";
import { salesQuery } from "@/gql/constants";
import ChartApp from "./chart/ChartApp";
import {
  getAgeGroup,
  initAgeDataMap,
  initMaleOrFemaleMap,
  sortDataMap,
} from "./chart/ChartUtils";

// GraphQLからのデータ取得を担う関数
export default function GqlGetData() {
  const client = useApolloClient();
  const [dataOfAgeLayer, setDataOfAgeLayer] = useState<any>();
  const [dataOfMaleOrFemale, setDataOfMaleOrFemale] = useState<any>();

  useEffect(() => {
    let allSales: any = [];

    const fetchSales = async (cursor: any = null) => {
      const { data: queryData } = await client.query({
        query: salesQuery,
        variables: {
          orderBy: [
            {
              id: OrderByDirection.AscNullsLast,
            },
          ],
          after: cursor,
        },
      });

      const salesCollection = queryData?.salesCollection;

      if (salesCollection != undefined) {
        allSales = allSales.concat(
          salesCollection.edges.map((edge) => edge.node)
        );

        if (salesCollection.pageInfo.hasNextPage) {
          await fetchSales(salesCollection.pageInfo.endCursor);
        }
      }
    };

    // 何歳の人がどの果物を何回買っているか？
    const getDataOfAgeLayer = async () => {
      const appleMap = initAgeDataMap();
      const orangeMap = initAgeDataMap();
      const bananaMap = initAgeDataMap();
      for (let i = 0; i < allSales.length; i++) {
        const saleElement = allSales[i];
        const ageGroup = getAgeGroup(saleElement["users"]["birthday"]);
        switch (saleElement["item_name"]) {
          case "りんご":
            const currentAppleValue = appleMap.get(ageGroup);
            appleMap.set(ageGroup, currentAppleValue! + 1);
            break;

          case "みかん":
            const currentOrangeValue = orangeMap.get(ageGroup);
            orangeMap.set(ageGroup, currentOrangeValue! + 1);
            break;

          case "バナナ":
            const currentBananaValue = bananaMap.get(ageGroup);
            bananaMap.set(ageGroup, currentBananaValue! + 1);
            break;

          default:
            break;
        }
      }

      const labels = ["10", "20", "30", "40", "50"];
      const appleData: any[] = [];
      const orangeData: any[] = [];
      const bananaData: any[] = [];
      appleMap.forEach((value, key) => {
        appleData.push(value);
      });
      orangeMap.forEach((value, key) => {
        orangeData.push(value);
      });

      bananaMap.forEach((value, key) => {
        bananaData.push(value);
      });

      const chartData = {
        labels,
        datasets: [
          {
            label: "リンゴ",
            data: appleData,
            backgroundColor: "rgba(255, 0, 0, 0.5)",
          },
          {
            label: "みかん",
            data: orangeData,
            backgroundColor: "rgba(0, 255, 0, 0.5)",
          },
          {
            label: "バナナ",
            data: bananaData,
            backgroundColor: "rgba(0, 0, 255, 0.5)",
          },
        ],
      };
      setDataOfAgeLayer(chartData);
    };

    // 各果物につき男性女性どちらが何回買っているか
    const getDataOfMaleOrFemale = async () => {
      const maleMap = initMaleOrFemaleMap();
      const femaleMap = initMaleOrFemaleMap();
      for (let i = 0; i < allSales.length; i++) {
        const saleElement = allSales[i];
        switch (saleElement["users"]["sex"]) {
          case 0:
            const currentMaleValue = maleMap.get(saleElement["item_name"]);
            maleMap.set(saleElement["item_name"], currentMaleValue! + 1);
            break;

          case 1:
            const currentFemaleValue = femaleMap.get(saleElement["item_name"]);
            femaleMap.set(saleElement["item_name"], currentFemaleValue! + 1);
            break;

          default:
            break;
        }
      }

      const labels = ["りんご", "みかん", "バナナ"];
      const maleData: any[] = [];
      const femaleData: any[] = [];
      maleMap.forEach((value, key) => {
        maleData.push(value);
      });
      femaleMap.forEach((value, key) => {
        femaleData.push(value);
      });

      const chartData = {
        labels,
        datasets: [
          {
            label: "男性",
            data: maleData,
            backgroundColor: "rgba(0, 0, 255, 0.5)",
          },
          {
            label: "女性",
            data: femaleData,
            backgroundColor: "rgba(255, 0, 0, 0.5)",
          },
        ],
      };
      setDataOfMaleOrFemale(chartData);
    };

    const init = async () => {
      await fetchSales();

      await getDataOfAgeLayer();
      await getDataOfMaleOrFemale();
    };
    init();
  }, [client]);

  return (
    <div>
      <ChartApp
        title="何歳代の人が累計何回購入したか？"
        chartData={dataOfAgeLayer}
      ></ChartApp>
      <ChartApp
        title="各果物を男性、女性がそれぞれ何個買ったか？"
        chartData={dataOfMaleOrFemale}
      ></ChartApp>
    </div>
  );
}
