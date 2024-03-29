import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/graphql/v1?apikey=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,

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
