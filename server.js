const { application } = require("express");
const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();
const knex = require("knex");
const register = require("./controllers/register");
const login = require("./controllers/login");
const USER_ID = "shubhamv";
const APP_ID = "116ff9b8510a4de4bb5aaffa487d6237";
const MODEL_ID = "face-detection";
const PAT = "504063f497e449b7b445dc7106ddab72";
const database = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "9833",
    database: "facedetector",
  },
});

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", async (req, res) => {
  res.json("Server Started");
});

app.get("/check", (req, res) => {
  res.json(
    bcrypt.compare(
      "hashed123",
      "$2b$10$LFS9MHu6C3Hd3hJYxb6f2Oz9pYbr.x1ZFNv0uTCHGsBfPYzPqDaaq",
      function (err, result) {
        console.log(result);
      }
    )
  );
});

app.get("/profile/:id", function (req, res) {
  database
    .select("*")
    .from("users")
    .where("id", req.params.id)
    .then((info) => {
      info.length ? res.json(info) : res.json("Not Found");
    })
    .catch((err) => {
      res.json(`error!`);
    });
});

app.put("/image", (req, res) => {
  database
    .select("*")
    .from("users")
    .where("id", req.body.id)
    .then((check) => {
      if (check.length) {
        console.log(req.body.id);
        database
          .select("*")
          .from("users")
          .where("id", "=", req.body.id)
          .increment("entries", 1)
          .then((incres) => {
            console.log(incres);
          });
        res.json(check);
      } else {
        res.json("Not Found");
      }
    })
    .catch((err) => {
      res.json("Error in Database Connection");
    });
});

app.post("/signin", (req, res) => {
  login.loginController(req, res, database, bcrypt);
});

app.post("/register", (req, res) => {
  register.registerController(req, res, database, bcrypt);
});

app.get("/checker", (req, res) => {
  db.users.forEach((d) => {
    d.email == req.body.email ? res.json(d) : res.json("Not Found");
  });
});

app.get("/entries/:email", (req, res) => {
  const { email } = req.params;
  database
    .select("entries")
    .from("users")
    .where({ email: email })
    .then((entries) =>
      entries.length ? res.json(entries) : res.json("Database Not Working")
    );
});

app.post("/imageDetect", (req, res) => {
  fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: req.body.ImageURL,
            },
          },
        },
      ],
    }),
  })
    .then((response) => response.json())
    .then((output) => {
      res.json(output);
    });
});

app.listen(process.env.port || 3000, () => {
  console.log(`Server Started at ${process.env.PORT}`);
});
