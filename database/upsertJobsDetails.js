const { clientConnect, clientClose } = require("./dbMongo");

module.exports = {
  upsertJobsDetails: async jobsDetails =>
    (client = await (() =>
      new Promise((resolve, reject) =>
        clientConnect()
          .then(client => {
            //console.log("Client Connected");
            var counter = 0;
            var insertCount = 0;
            var updateCount = 0;
            jobsDetails.map(jobDetail => {
              client
                .db("jenkins")
                .collection("jobsDetails")
                .updateOne(
                  { name: jobDetail.name },
                  { $set: jobDetail },
                  { upsert: true }
                )
                .then(result => {
                  if (result.upsertedCount > 0) {
                    insertCount += 1;
                  } else {
                    updateCount += 1;
                  }
                  counter = counter + 1;
                  if (counter == jobsDetails.length) {
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
