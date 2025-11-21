// https://docs.expo.dev/guides/using-eslint/
import { defineConfig } from "eslint";
import expoConfig from "eslint-config-expo/flat";

export default defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],

    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-filename-extension": ["warn", { extensions: [".jsx", ".tsx"] }],
      "import/no-unresolved": "off", 
    },
  },
]);
