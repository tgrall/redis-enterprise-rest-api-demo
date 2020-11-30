
const axios = require('axios');
const express = require('express');
const router = express.Router();
const redis = require("redis");


const REST_HOST = process.env.REST_HOST;
const REST_USER = process.env.REST_USER;
const REST_PASSWORD = process.env.REST_PASSWORD;


process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;



// if (REST_HOST == undefined) {
//     console.log("you must set the REST_HOST  environment variable");
// }

/* GET home page. */
router.get('/', function (req, expressResponse, next) {


  let url = `https://${REST_HOST}:9443/v1/bdbs`;


  axios.get(url, { auth: { username: REST_USER, password: REST_PASSWORD } })
    .then(res => {
      console.log("==================");
      console.log(res.data);
      console.log("==================");
      console.log(res.data[0].endpoints[0]);
      const host = res.data[0].endpoints[0].dns_name;
      const port = res.data[0].endpoints[0].port;
      const password = res.data[0].authentication_redis_pass;

      console.log("ENDPOINT " + res.data[0].endpoints[0].dns_name);
      console.log("PORT " + res.data[0].endpoints[0].port);
      console.log("Password " + res.data[0].authentication_redis_pass);
      console.log("==================");

      const client = redis.createClient(`redis://default:${password}@${host}:${port}`);
      client.set("foo", "bar");
      client.get("foo", function (err, value) {
        expressResponse.status(200).json(
          {
            "status": "OK",
            "code": 200,
            "db": `redis://default:${password}@${host}:${port}`,
            "get_foo": value,
            "rest_api": `https://${REST_HOST}:9443/v1/bdbs`,
            "REST_HOST": REST_HOST,
            "REST_PASSWORD": REST_PASSWORD,
            "REST_USER": REST_USER,            
          }
        );

      });



    })
    .catch(err => {
      expressResponse.status(500).json(
        {
          "status": "ERROR",
          "code": 5200,
          "rest_api": `https://${REST_HOST}:9443/v1/bdbs`,
          "REST_HOST": REST_HOST,
          "REST_PASSWORD": REST_PASSWORD?REST_PASSWORD:"NOT_SET",
          "REST_USER": REST_USER?REST_USER:"NOT_SET",
          "msg": "cannot connect to the database",
          "err": err.message,
        }
      );
    });


});

module.exports = router;
