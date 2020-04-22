const { clientConnect, clientClose } = require("./dbMongo");

module.exports = {
  getDetails: async (dbName, collectionName) =>
    (client = await (() =>
      new Promise((resolve, reject) =>
        clientConnect()
          .then(client => {
            client
              .db(dbName)
              .collection(collectionName)
              .find({})
              .toArray(function(err, result) {
                if (err) throw err;
                //console.log(result);
                resolve(result);
              });
          })
          .catch(err => {
            reject("ERROR AT DATABASE");
          })
      ))())
};
