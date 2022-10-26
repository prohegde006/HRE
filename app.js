const express = require("express");
const app = express();

const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

const https = require("https");
const request = require("request");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
    const email = req.body.email;
    const fname = req.body.fname;
    const lname = req.body.lname;

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };

    const url = "https://us21.api.mailchimp.com/3.0/lists/d902fea06a" 
    const jsonData = JSON.stringify(data);
    const options = {
        method:'POST',
        auth: 'prajwalHegde:1188a27b1e77c6d484f551a2cd4e799a-us21'
    }

    const request = https.request(url, options, function (response) {
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/")
});

app.post("/success", function(req, res){
    res.redirect("/")
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server Started");
});