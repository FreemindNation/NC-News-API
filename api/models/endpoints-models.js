const fs = require("fs/promises");

exports.selectEndpoints = () => {
  return fs.readFile("endpoints.json", "utf-8").then((response) => {
    const parsedResponse = JSON.parse(response);
    return parsedResponse;
  });
};
