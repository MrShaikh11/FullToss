const dbConn = require("./dbConn");
const cors = require("cors");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const UserModel = require("./models/users.models");
const auth = require("./middlewares/auth.middleware");
const ProductModel = require("./models/product.models"); // Assuming you have a product model
const path = require("path");
const fs = require("fs");

require("dotenv").config();
dbConn();

app.use(cors());
app.use(express.json());

// Add this route to fetch products

// Serve products data from the products.json file
app.get("/", (req, res) => {
  res.send("hello world");
});
app.get("/user", auth, (req, res) => {
  UserModel.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.json({ user });
      } else {
        res.status(404).send("No User Found!");
      }
    })
    .catch((error) => {
      res.status(500).send("Server Error!");
    });
});

app.get("/users", auth, (req, res) => {
  UserModel.find({}).then((users) => {
    if (users) {
      res.json({ users });
    } else res.send("No User Found!");
  });
});

app.get("/login", (req, res) => {
  try {
    const { email, password } = req.query;
    UserModel.findOne({ email: email }).then((user) => {
      if (!user) res.send("No such User exists.");
      else {
        if (password == user.password) {
          const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
          );
          res
            .header("Authorization", `Bearer ${token}`)
            .json({ message: "Logged in successfully", token });
        } else res.send("Invalid credentials");
      }
    });
    // res.json({ email, pass });
  } catch (error) {
    res.send("Fetching Users Error: ", error.message);
  }
});

app.post("/register", (req, res) => {
  const { name, email, password, city, color, team } = req.body;

  console.log("eeeeeee: ", name, email, password, city, color, team);

  UserModel.findOne({ email: email }).then((user) => {
    if (user) res.send('User with email: "' + user.email + '" already exists!');
    else {
      UserModel.create({
        name: name,
        email: email,
        password: password,
        city: city,
        color: color,
        team: team,
      })
        .then(() => {
          res.send("User succesfully created (Please Login)");
        })
        .catch((error) => {
          res.send(error.message);
        });
    }
  });
});

app.listen(8081, () => {
  console.log("Server is running on PORT 8081 ");
});
