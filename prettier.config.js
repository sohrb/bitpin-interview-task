/** @type {import("prettier").Config} */
const config = {
  plugins: ["prettier-plugin-packagejson"],
  overrides: [
    {
      files: "*.svg",
      options: {
        parser: "html",
      },
    },
  ],
};

export default config;
