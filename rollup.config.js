import typescript from "@rollup/plugin-typescript"

export default {
  input: "./src/index.ts",
  output: [
    // 1. cjs--->commonjs
    // 2. esm
    {
      format: "cjs",
      file: "lib/guide-my-vue.cjs.js"
    },
    {
      format: "es",
      file: "lib/guide-my-vue.esm.js"
    },
  ],
  plugins: [
    typescript()
  ]
}