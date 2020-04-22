const { clientConnect, clientClose } = require("./dbMongo");

module.exports = {
  upsertSlavesDetails: async slavesDetails =>
    (client = await (() =>
      new Promise((resolve, reject) =>
        clientConnect()
          .then(client => {
            //console.log("Client Connected");
            var counter = 0;
            var insertCount = 0;
            var updateCount = 0;
            slavesDetails.map(slaveDetail => {
              client
                .db("jenkins")
                .collection("slavesDetails")
                .updateOne(
                  { displayName: slaveDetail.displayName },
                  { $set: slaveDetail },
                  { upsert: true }
                )
                .then(result => {
                  if (result.upsertedCount > 0) {
                    insertCount += 1;
                  } else {
                    updateCount += 1;
                  }
                  counter = counter + 1;
                  if (counter == slavesDetails.length) {
                    resolve([insertCount, updateCount]);
                  }
                });
            });
          })
          .catch(err => {
            reject("ERROR AT DATABASE");
          })
      ))())
};
