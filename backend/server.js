const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var cors = require('cors');
const connect = async () => {
  await mongoose
    .connect("mongodb://:@localhost:27017/")
    .catch((error) => console.log(error));
};
connect();
const app = express();
app.use(cors());
const User = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cart: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
);
const Category = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);
const Product = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});
const model2 = mongoose.model("Category", Category);
const model = mongoose.model("User", User);
const model3 = mongoose.model("Product", Product);
app.use(express.json());

app.post("/v1/users/refresh_token", async (request, response) => {
  try {
    const token = request.headers["authorization"];
    if (!token) {
      return response
        .status(401)
        .json({ status: "validation_error", message: "missing token" });
    } else {
      jwt.verify(token, "123456", (error, user) => {
        if (error) {
          console.log(error);
          return response
            .status(401)
            .json({ status: "validation_error", message: "invalid token" });
        } else {
          const newacesstoken = jwt.sign({ id: user.id }, "12345", {
            expiresIn: "1d",
          });
          const newrefreshtoken = jwt.sign({ id: user.id }, "123456", {
            expiresIn: "7d",
          });
          return response.status(200).json({
            status: "ok",
            new_token: newacesstoken,
            new_refresh_token: newrefreshtoken,
          });
        }
      });
    }
  } catch (err) {
    return response.status(500).json({ status: "error", message: err.message });
  }
});
app.post("/v1/users/register", async (request, response) => {
  try {
    const { username, password } = request.body;
    if (!password && !username) {
      return response.status(400).json({
        status: "validation_error",
        message: "missing password and username",
      });
    }
    if (!password) {
      return response
        .status(400)
        .json({ status: "validation_error", message: "password is required" });
    } else {
      if (password.length < 16) {
        return response.status(400).json({
          status: "validation_error",
          message: "password is too short",
        });
      }
      if (password.length > 72) {
        return response.status(400).json({
          status: "validation_error",
          message: "password is too long",
        });
      }
    }
    if (!username) {
      return response
        .status(400)
        .json({ status: "validation_error", message: "username is required" });
    } else {
      if (username.length < 4) {
        return response.status(400).json({
          status: "validation_error",
          message: "username is too short",
        });
      } else {
        if (username.length > 15) {
          return response.status(400).json({
            status: "validation_error",
            message: "username is too long",
          });
        }
      }
      const user = await model.findOne({ username });
      if (user) {
        return response.status(500).json({
          status: "validation_error",
          message: "username already exists",
        });
      }
    }
    const hashed_password = await bcrypt.hash(password, 10);
    const user = await model.create({
      username: username,
      password: hashed_password,
    });
    if (user) {
      const acesstoken = jwt.sign({ id: user.id }, "12345", {
        expiresIn: "1d",
      });
      const refreshtoken = jwt.sign({ id: user.id }, "123456", {
        expiresIn: "7d",
      });
      return response
        .status(200)
        .json({ status: "ok", token: acesstoken, refresh_token: refreshtoken });
    }
  } catch (err) {
    return response.status(500).json({ status: "error", message: err.message });
  }
});
app.post("/v1/users/login", async (request, response) => {
  try {
    const { password, username } = request.body;
    if (!password && !username) {
      return response.status(400).json({
        status: "validation_error",
        message: "missing password and username",
      });
    }
    if (!password) {
      return response.status(400).json({
        status: "validation_error",
        message: "where is the password m8",
      });
    }
    if (!username) {
      return response.status(400).json({
        status: "validation_error",
        message: "where is the username m8",
      });
    }
    const user = await model.findOne({ username });
    if (!user) {
      return response.status(400).json({
        status: "validation_error",
        message: "username doesnt exist",
      });
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return response.status(400).json({
          status: "validation_error",
          message: "wrong password",
        });
      } else {
        const firstacesstoken = jwt.sign({ id: user.id }, "12345", {
          expiresIn: "1d",
        });
        const firstrefreshtoken = jwt.sign({ id: user.id }, "123456", {
          expiresIn: "7d",
        });
        return response.status(200).json({
          status: "ok",
          token: firstacesstoken,
          refresh_token: firstrefreshtoken,
        });
      }
    }
  } catch (err) {
    return response.status(500).json({ status: "error", message: err.message });
  }
});
const auth = (request, response, next) => {
  try {
    const token = request.headers["authorization"];
    if (!token) {
      return response.status(401).json({
        status: "validation_error",
        message: "missing validation token",
      });
    } else {
      jwt.verify(token, "12345", (error) => {
        if (error) {
          console.log(error);
          return response
            .status(401)
            .json({ status: "validation_error", message: "invalid token" });
        } else {
          next();
        }
      });
    }
  } catch (err) {
    return response.status(500).json({ status: "error", message: err.message });
  }
};
app.get("/v1/user/info", auth, async (request, response) => {
  try {
    let user_id = null;
    const token = request.headers["authorization"];
    await jwt.verify(token, "12345", (error, user) => {
      user_id = user.id;
    });
    const userInfo = await model
      .findById(user_id)
      .select("-password")
      .select("-__v")
      .select("-_id");
    return response.status(200).json({ status: "ok", info: userInfo });
  } catch (err) {
    return response.status(500).json({ status: "error", message: err.message });
  }
});
app.post("/v1/user/cart_add", auth, async (request, response) => {
  try {
    const token1 = request.headers["authorization"];
    if (!request.body.cart) {
      return response
        .status(400)
        .json({ status: "error", message: "missing item to add" });
    } else {
      let user_idd = null;
      await jwt.verify(token1, "12345", (error, user) => {
        user_idd = user.id;
      });
      const user1 = await model.findOneAndUpdate(
        { _id: user_idd },
        {
          $push: {
            cart: request.body.cart,
          },
        }
      );
      if (user1) {
        return response
          .status(200)
          .json({ status: "ok", message: request.body.cart });
      } else {
        return response
          .status(400)
          .json({ status: "error", message: "something went wrong" });
      }
    }
  } catch (err) {
    return response.status(500).json({ status: "error", message: err.message });
  }
});
app.get("/v1/products", auth, async (request, response) => {
  try {
    const products = await model3.find().select("-__v").select("-_id");
    if (products) {
      return response.status(200).json({ status: "ok", message: products });
    } else {
      return response
        .status(400)
        .json({ status: "error", message: "something went wrong" });
    }
  } catch (err) {
    return response.status(500).json({ status: "error", message: err.message });
  }
});
app.get("/v1/categories", auth, async (request, response) => {
  try {
    const products1 = await model2.find().select("-__v").select("-_id");
    if (products1) {
      return response.status(200).json({ status: "ok", message: products1 });
    } else {
      return response
        .status(400)
        .json({ status: "error", message: "something went wrong" });
    }
  } catch (err) {
    return response.status(500).json({ status: "error", message: err.message });
  }
});
app.listen(8080, (er) => {
  if (er) {
    console.log(er);
  } else {
    console.log("running...");
  }
});
