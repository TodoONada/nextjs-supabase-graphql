import { CodegenConfig } from "@graphql-codegen/cli";

// SCHEMA_URLは.env.localに追加
// https://{projectのreference_id}/graphql/v1　の形式で作成する
const config: CodegenConfig = {
  schema: {
    [process.env.NEXT_PUBLIC_SCHEMA_URL!]: {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
    },
  },

  documents: ["**/*.tsx", "**/*.ts"],

  generates: {
    "./gql/__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
