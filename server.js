require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5001;

app.use(cookieParser());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/health", (req, res, next) => {
  res.status(200).json({ status: "OK" });
});

app.post("/login", (req, res, next) => {
  const userName = req.body.userName;
  // autheticate user
  const user = { userName };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.status(200).json({ accessToken: accessToken });
});

const authMiddleware = (req, res, next) => {
    const bearerToken = req.headers["authorization"];
    
    if (!bearerToken) {
      return res.status(401).json({ error: "Authorization header missing" });
    }
  
    const token = bearerToken.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }
  
    try {
      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = user;
      next();
    } catch (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
  };
  

const totalPosts = [
  { id: 1, name: "Varaprasad", postName: "post1" },
  { id: 2, name: "Hemanth", postName: "post2" },
];

app.get("/posts", authMiddleware, (req, res, next) => {
  const posts = totalPosts.filter(post => post.name === req.user.userName);
  res.status(200).json({ data: posts });
});

app.use((err, req, res, next) => {
    res.status(500).json({ error: "Server error"});
});

app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
})

module.exports = app;
