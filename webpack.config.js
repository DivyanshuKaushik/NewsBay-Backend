module.exports = {
  target: "node",
  mode: "production",
  module: {
    rules: [{ test: /\.node$/, use: "node-loader" }],
  },
};
