var jenkinsapi = require("jenkins-api");

var JENKINS_MASTER = process.env.JENKINS_MASTER;
var JENKINS_USERNAME = process.env.JENKINS_USERNAME;
var JENKINS_PASSWORD = process.env.JENKINS_PASSWORD;

var jenkins = jenkinsapi.init(
  "http://" + JENKINS_USERNAME + ":" + JENKINS_PASSWORD + "@" + JENKINS_MASTER
);

function getAllJobs() {
  return new Promise((resolve, reject) => {
    jenkins.all_jobs(function(err, data) {
      if (err) {
        reject(err);
      } else {
        var finalData = [];
        if (data.length > 0) {
          data.map(function(job) {
            finalData.push({ name: job.name, url: job.url, color: job.color });
          });
        }
        resolve(finalData);
      }
    });
  });
}

function getJobInfo(job) {
  return new Promise((resolve, reject) => {
    var lastSuccessfulBuild;
    var lastFailedBuild;
    var healthReport;
    jenkins.job_info(job.name, function(err, data) {
      if (err) {
        reject(err);
      } else {
        var finalData = job;
        if (data.lastSuccessfulBuild) {
          lastSuccessfulBuild = data.lastSuccessfulBuild.number;
        } else {
          lastSuccessfulBuild = null;
        }

        if (data.lastFailedBuild) {
          lastFailedBuild = data.lastFailedBuild.number;
        } else {
          lastFailedBuild = null;
        }

        if (data.healthReport.length > 0) {
          healthReport = data.healthReport[0].score;
        } else {
          healthReport = null;
        }
        finalData["lastSuccessfulBuild"] = lastSuccessfulBuild;
        finalData["lastFailedBuild"] = lastFailedBuild;
        finalData["healthReport"] = healthReport;
        resolve(finalData);
      }
    });
  });
}

function getAllBuilds(job) {
  return new Promise((resolve, reject) => {
    var noOfTodayBuilds = 0;
    var lastSevenDayBuilds = 0;
    var lastFourteenDayBuilds = 0;
    jenkins.all_builds(job.name, function(err, data) {
      if (err) {
        reject(err);
      } else {
        var finalData = job;
        if (data.length > 0) {
          finalData["allBuilds"] = [];
          finalData["lastSevenDaysSuccess"] = [];
          finalData["lastSevenDaysFailure"] = [];
          var count = 0;
          var currentDate = new Date();
          var startOfToday = currentDate.setHours(0, 0, 0, 0);
          var startOfLastFourteenthDay =
            startOfToday - 14 * 24 * 60 * 60 * 1000;
          var startOfLastSeventhDay = startOfToday - 7 * 24 * 60 * 60 * 1000;
          var startOfLastSixthDay = startOfToday - 6 * 24 * 60 * 60 * 1000;
          var startOfLastFifthDay = startOfToday - 5 * 24 * 60 * 60 * 1000;
          var startOfLastFourthDay = startOfToday - 4 * 24 * 60 * 60 * 1000;
          var startOfLastThirdDay = startOfToday - 3 * 24 * 60 * 60 * 1000;
          var startOfLastSecondDay = startOfToday - 2 * 24 * 60 * 60 * 1000;
          var startOfLastFirstDay = startOfToday - 1 * 24 * 60 * 60 * 1000;

          var last1DaySuccess = 0;
          var last1DayFailure = 0;
          var last2DaySuccess = 0;
          var last2DayFailure = 0;
          var last3DaySuccess = 0;
          var last3DayFailure = 0;
          var last4DaySuccess = 0;
          var last4DayFailure = 0;
          var last5DaySuccess = 0;
          var last5DayFailure = 0;
          var last6DaySuccess = 0;
          var last6DayFailure = 0;
          var last7DaySuccess = 0;
          var last7DayFailure = 0;
          data.map(function(build) {
            var successCount = 0;
            var failureCount = 0;
            finalData["allBuilds"][count] = {};
            finalData["allBuilds"][count]["duration"] = build.duration;
            finalData["allBuilds"][count]["id"] = build.id;
            finalData["allBuilds"][count]["result"] = build.result;
            finalData["allBuilds"][count]["timestamp"] = build.timestamp;
            if (build.timestamp - startOfToday > 0) {
              noOfTodayBuilds = noOfTodayBuilds + 1;
            } else {
              if (build.timestamp - startOfLastSeventhDay > 0) {
                lastSevenDayBuilds = lastSevenDayBuilds + 1;
                if (
                  build.timestamp > startOfLastFirstDay &&
                  build.timestamp < startOfToday
                ) {
                  if (build.result == "SUCCESS") {
                    successCount += 1;
                  }
                  if (build.result == "FAILURE") {
                    failureCount += 1;
                  }
                  last1DaySuccess = successCount;
                  last1DayFailure = failureCount;
                }
                if (
                  build.timestamp > startOfLastSecondDay &&
                  build.timestamp < startOfLastFirstDay
                ) {
                  if (build.result == "SUCCESS") {
                    successCount += 1;
                  }
                  if (build.result == "FAILURE") {
                    failureCount += 1;
                  }
                  last2DaySuccess = successCount;
                  last2DayFailure = failureCount;
                }
                if (
                  build.timestamp > startOfLastThirdDay &&
                  build.timestamp < startOfLastSecondDay
                ) {
                  if (build.result == "SUCCESS") {
                    successCount += 1;
                  }
                  if (build.result == "FAILURE") {
                    failureCount += 1;
                  }
                  last3DaySuccess = successCount;
                  last3DayFailure = failureCount;
                }
                if (
                  build.timestamp > startOfLastFourthDay &&
                  build.timestamp < startOfLastThirdDay
                ) {
                  if (build.result == "SUCCESS") {
                    successCount += 1;
                  }
                  if (build.result == "FAILURE") {
                    failureCount += 1;
                  }
                  last4DaySuccess = successCount;
                  last4DayFailure = failureCount;
                }
                if (
                  build.timestamp > startOfLastFifthDay &&
                  build.timestamp < startOfLastFourthDay
                ) {
                  if (build.result == "SUCCESS") {
                    successCount += 1;
                  }
                  if (build.result == "FAILURE") {
                    failureCount += 1;
                  }
                  last5DaySuccess = successCount;
                  last5DayFailure = failureCount;
                }
                if (
                  build.timestamp > startOfLastSixthDay &&
                  build.timestamp < startOfLastFifthDay
                ) {
                  if (build.result == "SUCCESS") {
                    successCount += 1;
                  }
                  if (build.result == "FAILURE") {
                    failureCount += 1;
                  }
                  last6DaySuccess = successCount;
                  last6DayFailure = failureCount;
                }
                if (
                  build.timestamp > startOfLastSeventhDay &&
                  build.timestamp < startOfLastSixthDay
                ) {
                  if (build.result == "SUCCESS") {
                    successCount += 1;
                  }
                  if (build.result == "FAILURE") {
                    failureCount += 1;
                  }
                  last7DaySuccess = successCount;
                  last7DayFailure = failureCount;
                }
              }
              if (build.timestamp - startOfLastFourteenthDay > 0) {
                lastFourteenDayBuilds = lastFourteenDayBuilds + 1;
              }
            }
            count = count + 1;
          });
        } else {
          noOfTodayBuilds = 0;
          lastSevenDayBuilds = 0;
          lastFourteenDayBuilds = 0;
        }

        finalData["lastSevenDaysSuccess"] = [
          last7DaySuccess,
          last6DaySuccess,
          last5DaySuccess,
          last4DaySuccess,
          last3DaySuccess,
          last2DaySuccess,
          last1DaySuccess
        ];
        finalData["lastSevenDaysFailure"] = [
          last7DayFailure,
          last6DayFailure,
          last5DayFailure,
          last4DayFailure,
          last3DayFailure,
          last2DayFailure,
          last1DayFailure
        ];
        finalData["noOfTodayBuilds"] = noOfTodayBuilds;
        finalData["lastSevenDayBuilds"] = lastSevenDayBuilds;
        finalData["lastFourteenDayBuilds"] = lastFourteenDayBuilds;
        resolve(finalData);
      }
    });
  });
}

function handleGetJobInfo(data) {
  return Promise.all(
    data.map(function(job) {
      return getJobInfo(job);
    })
  );
}

function handleGetAllBuilds(data) {
  return Promise.all(
    data.map(function(job) {
      return getAllBuilds(job);
    })
  );
}

exports.collectData = function(callback) {
  const getAllJobsPromise = getAllJobs();
  getAllJobsPromise
    .then(handleGetJobInfo)
    .then(handleGetAllBuilds)
    .then(data => {
      callback(data);
    })
    .catch(err => {
      callback("ERROR AT JENKINS");
    });
};
