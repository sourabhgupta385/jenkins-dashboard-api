var jenkinsapi = require("jenkins-api");

var JENKINS_MASTER = process.env.JENKINS_MASTER;
var JENKINS_USERNAME = process.env.JENKINS_USERNAME;
var JENKINS_PASSWORD = process.env.JENKINS_PASSWORD;

var jenkins = jenkinsapi.init(
  "http://" + JENKINS_USERNAME + ":" + JENKINS_PASSWORD + "@" + JENKINS_MASTER
);

function getAllComputers() {
  return new Promise((resolve, reject) => {
    jenkins.computers(function(err, data) {
      if (err) {
        reject(err);
      } else {
        var finalData = {};
        var totalMasters = 0;
        var totalSlaves = 0;
        var index = 0;
        finalData["computers"] = [];
        finalData["totalExecutors"] = data.totalExecutors;
        if (data.computer.length > 0) {
          data.computer.map(function(device) {
            if (device._class == "hudson.model.Hudson$MasterComputer") {
              totalMasters += 1;
            }
            if (device._class == "hudson.slaves.SlaveComputer") {
              totalSlaves += 1;
            }
            finalData["computers"][index] = {};
            finalData["computers"][index]["assignedLabels"] =
              device.assignedLabels;
            finalData["computers"][index]["description"] = device.description;
            finalData["computers"][index]["displayName"] = device.displayName;
            finalData["computers"][index]["numExecutors"] = device.numExecutors;
            finalData["computers"][index]["offline"] = device.offline;
            finalData["computers"][index]["offlineCause"] = device.offlineCause;
            finalData["computers"][index]["offlineCauseReason"] =
              device.offlineCauseReason;
            if (
              device.monitorData["hudson.node_monitors.ArchitectureMonitor"] !=
              null
            ) {
              finalData["computers"][index]["architecture"] =
                device.monitorData["hudson.node_monitors.ArchitectureMonitor"];
            } else {
              finalData["computers"][index]["architecture"] = "NA";
            }
            if (
              device.monitorData["hudson.node_monitors.DiskSpaceMonitor"] !=
              null
            ) {
              finalData["computers"][index]["freeSpace"] = (
                device.monitorData["hudson.node_monitors.DiskSpaceMonitor"]
                  .size /
                (1024 * 1024 * 1024)
              ).toFixed(2);
            } else {
              finalData["computers"][index]["freeSpace"] = "NA";
            }
            index += 1;
          });
        }
        finalData["totalMasters"] = totalMasters;
        finalData["totalSlaves"] = totalSlaves;
        resolve(finalData);
      }
    });
  });
}

exports.collectData = function(callback) {
  const getAllComputersPromise = getAllComputers();
  getAllComputersPromise
    .then(data => {
      callback(data);
    })
    .catch(err => {
      callback("ERROR AT JENKINS");
    });
};
