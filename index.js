/* I-----------------------------------I
   I            Noteboard              I
   I-----------------------------------I

  NOTE: Removed Captcha, isn't necessary
*/
const {review} = require("./flag");
const express = require("express");
const parser = require("body-parser");
const Enmap = require("enmap");

const app = express();
const db = new Enmap({autoFetch: true, fetchAll: false, name: "users"});
app.use(parser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/static"));

app.get("/source", (req, res) => {
    res.setHeader("Content-Type", "application/javascript")
    res.sendFile(__dirname + "/index.js");
});

app.post("/submit", (req, res) => {
    if(req.body.name && req.body.aboutMe) {
        if(db.has(req.body.name)) return res.redirect("/");
        db.set(req.body.name, req.body.aboutMe);
        return res.redirect("/u/"+req.body.name);
    }
    res.status(302).redirect("/");
});

app.get("/u/:id", (req, res) => {
    if(!db.has(req.params.id)) return;
    let a = JSON.stringify(db.get(req.params.id));
    res.render("index.ejs", {
        name: req.params.id,
        aboutMe: a.substring(1, a.length-1),
    });
});

app.get("/review/:id", (req, res) => {
    review("http://localhost:3000/u/" + req.params.id + "?noInfo=true");
    res.redirect("/u/" + req.params.id);
});

app.listen(3000, () => {});
