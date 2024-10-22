const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWTSECRET = "This is the secret key";
const BlockedIp = require('../models/BlockedIP');

let count = 0;
const BLOCK_DURATION = 15 * 60 * 1000; 



// Route 1 : create a user using POST: "/api/auth/createUser".No login required
router.post(
  "/createUser",
  [
    body("name", "The name should be minimum of 3 words").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //If there are errors return bad requests and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Check whether user with this  email exists already(user exists )

    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(400)
          .json({ error: "sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secretPassword = await bcrypt.hash(req.body.password, salt);

      //create a user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secretPassword,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWTSECRET);
      res.json({ authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server error occured");
    }
  }
);

//Route 2 : Authenticate  a user using POST: "/api/auth/login".No login required
function normalizeIP(ip) {
  if (ip.startsWith('::ffff:')) {
    return ip.substring(7);
  }
  return ip;
}


// Middleware to check if the IP is blocked
async function isBlocked(ip) {
  const normalizedIp = normalizeIP(ip);
  const blockEntry = await BlockedIp.findOne({ ip: normalizedIp });

  if (!blockEntry) return false;

  // Check if the block duration has expired
  if (Date.now() - blockEntry.blockedAt > BLOCK_DURATION) {
    // Remove expired block
    // console.log(`Unblocking IP: ${normalizedIp}, was blocked for ${BLOCK_DURATION / 60000} minutes.`);
    await BlockedIp.deleteOne({ ip: normalizedIp });
    return false;
  }
  return true;
}

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false
    //If there are errors ,return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const rawClientIp =
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
  

    const clientIp = normalizeIP(rawClientIp);

    //After IP is blocked , when we try to send a request it is called
    if (await isBlocked(clientIp)) {
      console.log(`Blocked IP attempt: ${clientIp}`);
      return res.status(403).json({ error: 'Access forbidden' });
    }




    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false
        return res
          .status(400)
          .json({success, error: "Please try to login with correct Credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      
      if (!passwordCompare) {
        success = false
        count = count + 1;

        // console.log(count)

        //Storing the blocked IP address in DataBase
        if (count >= 5) {
          
          const blockTime = new Date();
          await new BlockedIp({ ip: clientIp, blockedAt: blockTime }).save();
          const unblockTime = new Date(blockTime.getTime() + BLOCK_DURATION).toLocaleString();
          // console.log(`Blocking IP: ${clientIp}`);
          console.log(`IP ${clientIp} is Blocked at: ${blockTime.toLocaleString()}. It will be unblocked at ${unblockTime}.`);
          count = 0; 
        }
        return res
          .status(400)
          .json({success, error: "Please try to login with correct Credentials pp" });
      }
      count = 0;

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWTSECRET);
      success = true
      res.json({success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server occcured");
    }
  }
);

//Route 3 : Get logged in user details using POST: "/api/auth/getUser".No login required
router.post("/getUser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server occcured");
  }
});
module.exports = router;
