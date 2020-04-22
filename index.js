var express = require("express");
var app = express();
const cors = require("cors");
var jenkinsJobsCollector = require("./jenkins-collector/jobs");
const { upsertJobsDetails } = require("./database/upsertJobsDetails");
var jenkinsSlavesCollector = require("./jenkins-collector/slaves");
const { upsertSlavesDetails } = require("./database/upsertSlavesDetails");
const { getDetails } = require("./database/getDetails");

app.use(cors());

app.get("/getJobsDetails", (req, res, next) => {
  jenkinsJobsCollector.collectData(function(jobsDetails) {
    if (jobsDetails != "ERROR AT JENKINS") {
      upsertJobsDetails(jobsDetails)
        .then(data => {
          console.log(`${data[0]} jobs were inserted`);
          console.log(`${data[1]} jobs were updated`);
        })
        .catch(err => {
          console.log(
            "###########################################################################"
          );
          console.log("");
          console.log("");
          console.log(
            "There is some problem while connecting to mongoDB. Please check logs."
          );
          console.log("");
          console.log("");
          console.log(
            "###########################################################################"
          );
        });
      return res.json(jobsDetails);
    } else {
      getDetails("jenkins", "jobsDetails")
        .then(data => {
          if (data.length > 0) {
            res.json(data);
          } else {
            res.json(
              "No data is present at moment. Please check your configuration..."
            );
          }
        })
        .catch(err => {
          res.json(
            "Either Jenkins or mongoDB is not configured properly. Please check logs and configuration..."
          );
        });
    }
  });
});

app.get("/getSlavesDetails", (req, res, next) => {
  jenkinsSlavesCollector.collectData(function(slavesDetails) {
    if (slavesDetails != "ERROR AT JENKINS") {
      upsertSlavesDetails(slavesDetails.computers)
        .then(data => {
          console.log(`${data[0]} slaves were inserted`);
          console.log(`${data[1]} slaves were updated`);
        })
        .catch(err => {
          console.log(
            "###########################################################################"
          );
          console.log("");
          console.log("");
          console.log(
            "There is some problem while connecting to mongoDB. Please check logs."
          );
          console.log("");
          console.log("");
          console.log(
            "###########################################################################"
          );
        });
      return res.json(slavesDetails);
    } else {
      getDetails("jenkins", "slavesDetails")
        .then(data => {
          if (data.length > 0) {
            res.json(data);
          } else {
            res.json(
              "No data is present at moment. Please check your configuration..."
            );
          }
        })
        .catch(err => {
          res.json(
            "Either Jenkins or mongoDB is not configured properly. Please check logs and configuration..."
          );
        });
    }
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
