module.exports = {
  target: "node",
  mode: "none",
  node: {
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        loader: "node-loader",
      },
    ],
  }
  // module: {
  //   rules: [{ test: /\.node$/, use: "node-loader" },{ test: /\.js$/, use: "babel-loader" }],
  // },
};
