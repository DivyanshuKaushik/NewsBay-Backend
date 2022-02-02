const Response = (code, data) => {
  return {
    headers: {
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    },
    statusCode: code,
    body: JSON.stringify(data),
  };
};
module.exports = Response;
