# Jenkins Dashboard API

This API is designed to fetch data from Jenkins and store the fetched data in mongoDB.

* [API Description](#api-description "Goto API Description")
* [Pre-Requisites](#pre-requisites "Goto Pre-Requisites")
* [Installation](#installation "Goto Installation")

## API Description

This API gives below two routes:

1. **/getJobsDetails**: This gives details of all jobs present in Jenkins.
2. **/getSlavesDetails**: This gives details of all masters and slaves in Jenkins.

## Pre-Requisites

To get this API running, first you need to set below environment variables:


Variable Key          | Variable Description                 | Variable Example Value
--------------------- | ------------------------------------ | -----------------------
JENKINS_MASTER        | Domain name of Jenkins Instance      | localhost:8085
JENKINS_USERNAME      | Username of admin account in Jenkins | admin
JENKINS_PASSWORD      | Password of admin account in Jenkins | password
DB_CONNECTION_STRING  | Mongo DB connection string           | dashboard-database-h8w2s.mongodb.net/test?retryWrites=true&w=majority
DB_USERNAME           | Username of one account in mongoDB   | dbUser
DB_PASSWORD           | Password of one account in mongoDB   | dbPassword

## Installation

1. Set all the environment variables correctly as defined in previous section.

2. Install all dependencies

```
$ npm install
```

3. Run the API 

```
$ node index.js
```
