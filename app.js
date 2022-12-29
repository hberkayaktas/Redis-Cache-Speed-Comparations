const express = require("express");
const axios = require("axios");
const redis = require("redis");

const app = express();

const port = 3000;

// make a connection to the local instance of redis
//const client = redis.createClient(5252);

const client = redis.createClient(6379, "127.0.0.1");

client.on("error", (error) => {
  console.error(error);
});

client
  .connect()
  .then(() => {
    console.log("Connected to Redis server");
  })
  .catch((err) => {
    console.error(err);
  });

client.set("key", "value2", (err, reply) => {
  console.log(err, reply);
});
// client
//   .get("key")
//   .then((value) => {
//     console.log(value); // 'value'
//   })
//   .catch((err) => {
//     console.error(err);
//   });

app.get("/todos/get", async (req, res) => {
  try {
    const foodItem = "coffee";
    const keys =await client.get(foodItem);
    console.log(keys);
    if (!keys) {
      
      axios
        .get(`https://jsonplaceholder.typicode.com/todos/1`)
        .then(response => {
            console.log(response.data);
            client.set(foodItem, JSON.stringify(response.data), (err, reply) => {
                console.log(err, reply);
              });
            res.status(200).send({...response.data, restype:"req response"})
          })
          .catch(error => {
            console.log(error);
          });
      
    } else {
     res.status(202).send({ ...JSON.parse(keys),restype:"cache response" });
    }
  } catch (error) {
    //console.log(error);
  }
});

app.get("/todos/delete", async (req, res) => {
  try {
    const foodItem = "coffee";
    
    let del  = await client.del(foodItem, (err, deleted) => {
      if (err) throw err;
      console.log(deleted);
    });

    res.status(202).send({del});

  } catch (error) {
    console.log(error);
  }
});
app.get("/todos/exist", async (req, res) => {
  try {
    const foodItem = "coffee";
    
    let exist  =await client.exists(foodItem, (err, exists) => {
        if (err) throw err;
        console.log(exists);
      });

    res.status(202).send({exist});
  } catch (error) {
    console.log(error);
  }
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;


// client.exists('key', (err, exists) => {
//   if (err) throw err;
//   console.log(exists);
// });

// client.set('key', 'value', 'EX', 3600);