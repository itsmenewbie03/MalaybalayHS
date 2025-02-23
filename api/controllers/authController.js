const jwt = require('jsonwebtoken')
const jwtSecret = '7b7e03a9c80a1471c1191483bc9b418ed653af0dbe2789483b1e1de70d449258c47e21'
const User = require("../models/userModel")
const bcrypt = require("bcryptjs")

//create user
exports.register = async (req, res, next) => {
    const { email, password } = req.body

    bcrypt.hash(password, 10).then(async (hash) => {
      await User.create({
        email,
        password: hash,
      })
        .then((user) => {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, email, role: user.role },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(201).json({
            message: "User successfully created",
            user: user._id,
          });
        })
        .catch((error) =>
          res.status(400).json({
            message: "User not successful created",
            error: error.message,
          })
        );
    });
  };

  //login function
  exports.login = async (req, res, next) => {
    const { email, password } = req.body
    // Check if email and password is provided
    if (!email || !password) {
      return res.status(400).json({
        message: "email or Password not present",
      })
    }
  }

  exports.login = async (req, res, next) => {
    const { email, password } = req.body
    // Check if email and password is provided
    if (!email || !password) {
      return res.status(400).json({
        message: "email or Password not present",
      })
    }
    try {
      const user = await User.findOne({ email });
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, email, role: user.role },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(201).json({
            message: "User successfully Logged in",
            user: user._id,
          });
        } else {
          res.status(400).json({ message: "Login not successful" });
        }
      });
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }}

  exports.update = async (req, res, next) => {
    const { role, id } = req.body
    // Verifying if role and id is presnt
    if (role && id) {
      // Verifying if the value of role is admin
      if (role === "admin") {
        await User.findById(id)
      } else {
        res.status(400).json({
          message: "Role is not admin",
        })
      }
    } else {
      res.status(400).json({ message: "Role or Id not present" })
    }
  }

  exports.update = async (req, res, next) => {
    const { role, id } = req.body;
  
    // Check if both role and id are present
    if (!role || !id) {
      return res.status(400).json({ message: "Role or Id not present" });
    }
  
    try {
      // Find the user by id
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Verify if the value of role is "admin" and the user is not already an admin
      if (role === "admin" && user.role !== "admin") {
        user.role = role;
        await user.save(); // Save the updated user
        return res.status(201).json({ message: "Update successful", user });
      } else {
        return res.status(400).json({ message: "User is already an Admin" });
      }
    } catch (error) {
      return res.status(500).json({ message: "An error occurred", error: error.message });
    }
  };

  //delete user
  exports.deleteUser = async (req, res, next) => {
    const { id } = req.body
    await User.findById(id)
      .then(user => user.deleteOne())
      .then(user =>
        res.status(201).json({ message: "User successfully deleted", user })
      )
      .catch(error =>
        res
          .status(400)
          .json({ message: "An error occurred", error: error.message })
          )
  }

  //admin authentication
  exports.adminAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          if (decodedToken.role !== "admin") {
            return res.status(401).json({ message: "Not authorized" })
          } else {
            next()
          }
        }
      })
    } else {
      return res
        .status(401)
        .json({ message: "Not authorized, token not available" })
    }
  }

  exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          if (decodedToken.role !== "Basic") {
            return res.status(401).json({ message: "Not authorized" })
          } else {
            next()
          }
        }
      })
    } else {
      return res
        .status(401)
        .json({ message: "Not authorized, token not available" })
    }
  }