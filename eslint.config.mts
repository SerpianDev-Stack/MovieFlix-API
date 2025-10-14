
import type { Linter } from "eslint"; // 1. Importa o tipo 'Linter'
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin"; 

// 2. Aplica o tipo 'Linter.FlatConfig[]' explicitamente à função defineConfig
const config: Linter.FlatConfig[] = defineConfig([
  // --- CONFIGURAÇÕES BASE ---
  
  // 1. Configurações de JS
  { files: ["**/*.{js,mjs,cjs}"], extends: [js.configs.recommended], languageOptions: { globals: globals.node } },
  
  // 2. Configurações de TypeScript
  ...tseslint.configs.recommended,
  { 
      files: ["**/*.{ts,mts,cts,tsx}"],
      languageOptions: {
          parser: tseslint.parser,
          parserOptions: { project: "./tsconfig.json" }
      }
  },

  // --- CONFIGURAÇÕES DE ESTILO ---
  
  {
    files: ["**/*.{js,jsx,ts,tsx}"], 
    
    plugins: {
        "@stylistic": stylistic,
    },
    
    rules: {
      "quotes": "off", 
      "semi": "off",   

      "@stylistic/quotes": ["error", "double", { "avoidEscape": true, "allowTemplateLiterals": "always" }],
      "@stylistic/semi": ["error", "always"],
    }
  },

  // --- CONFIGURAÇÕES DE FORMATOS DE DADOS ---
  { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
  { files: ["**/*.jsonc"], plugins: { json }, language: "json/jsonc", extends: ["json/recommended"] },
  { files: ["**/*.json5"], plugins: { json }, language: "json/json5", extends: ["json/recommended"] },
   {
    files: ["package-lock.json"], // Aplica-se apenas ao arquivo de lock
    rules: {
      "json/no-empty-keys": "off", // Desativa a regra 'Empty key found'
    }
  }
]);

export default config; // Exporta a constante tipa