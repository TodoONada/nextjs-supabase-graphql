"use client";
import GqlGetData from "@/components/GqlGetData";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { supabase } from "@/utils/supabase/client";

const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/graphql/v1`,
});

const authLink = setContext(async (_, { headers }) => {
  const session = (await supabase.auth.getSession()).data.session;

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${
        session
          ? session.access_token
          : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }`,
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  };
});

const apolloClient = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/graphql/v1`,
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-4 items-center">
      <h1 className="pt-10 text-xl">集計APIのサンプル</h1>
      <ApolloProvider client={apolloClient}>
        <GqlGetData></GqlGetData>
      </ApolloProvider>
    </div>
  );
}
