const express = require("express");
const app = express();
var jwt = require("jsonwebtoken");
const secretKey = "secretKey";
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Digikull");
});

//calculator:

//get data
let x = 100;
app.get("/calculator", (req, res) => {
  res.json(x);
});

//update data
app.put("/calculator", varifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (error, authData) => {
    if (!error) {
      res.json({
        message: "value update",
        data: x + req.body.value,
        authData,
      });
    } else {
      res.json({ result: "Invalid Token" });
    }
  });
});

//delete:
app.delete("/calculator", varifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (!err) {
      res.json({
        message: "value has Deleted",
        data: (x = 0),
        authData,
      });
    } else {
      res.json({ result: "Invalid Token" });
    }
  });
});

//todo:
let arr = [1, 2, 3];

//get data
app.get("/todo", (req, res) => {
  res.send(arr);
});

//create todo:
app.post("/todo", varifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (!err) {
      res.json({
        message: "value add in array",
        array: arr.push(req.body.value),
        authData,
      });
    } else {
      res.json({ result: "Invalid Token" });
    }
  });
});

//delete todo:
app.delete("/todo/:id", varifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (!err) {
      const index = Number(req.params.id);
      for (let i = 0; i < arr.length; i++) {
        if (index == i) {
          arr.splice(i, 1);
          break;
        }
      }
      res.json({
        message: "Index value has deleted",
        arr,
      });
    } else {
      res.json({ result: "Invalid Token" });
    }
  });
});

//login:
app.post("/login", (req, res) => {
  const user = {
    id: 1,
    username: "admin",
    email: "abc@test.com",
  };
  //create token:
  jwt.sign({ user }, secretKey, { expiresIn: "1000s" }, (err, token) => {
    res.json({
      token,
    });
  });
});

//varifyToken:
function varifyToken(req, res, next) {
  const bearerHeader = req.headers["authentication"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split("-");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.send({
      result: "Token is not available",
    });
  }
}

app.listen(4000, () => console.log("listening server 4k..."));
