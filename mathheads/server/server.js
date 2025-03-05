// server.js
const express = require("express");
const app = express();
app.get("/api/auth/me", (req, res) => res.json({ user: "test" }));
app.listen(5000, () => console.log("Listening on 5000"));
