import { gql } from "./__generated__";

/** セールステーブル一覧取得クエリー */
export const salesQuery = gql(`
query SalesQuery($orderBy: [salesOrderBy!], $after: Cursor) {
  salesCollection(orderBy: $orderBy, after: $after) {
    edges {
      cursor
      node {
        id
        created_at
        user_id
        purchase_date
        item_name
        price
        users {
          id
          created_at
          name
          birthday
          sex
        }
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasPreviousPage
      hasNextPage
    }
  }
}
`);
