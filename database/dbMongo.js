const MongoClient = require("mongodb").MongoClient;

var DB_USERNAME = process.env.DB_USERNAME;
var DB_PASSWORD = process.env.DB_PASSWORD;
var DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

module.exports = {
  /*
   * Mongo Utility: Connect to client */

  clientConnect: async () =>
    (client = await (() =>
      new Promise((resolve, reject) =>
        MongoClient.connect(
          "mongodb+srv://" +
            DB_USERNAME +
            ":" +
            DB_PASSWORD +
            "@" +
            DB_CONNECTION_STRING,
          (err, client) => {
            if (err) {
              console.log(err);
              reject("ERROR AT DATABASE");
            } else {
              resolve(client);
            }
          }
        )
      ))()),

  /*
   * Mongo Utility: Close client */

  clientClose: async client => {
    client.close();
    return true;
  }
};
