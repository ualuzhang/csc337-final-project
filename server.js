const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');

const port = 3000;

const app = express();
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
app.use(cookieParser());

const db = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/Ostaa';

function authenticate(req, res, next) {
    console.log(req.cookies);
    console.log(sessionKeys);
    if (Object.keys(req.cookies).length > 0) {
        let u = req.cookies.login.username;
        let key = req.cookies.login.key;
        if ( Object.keys(sessionKeys[u]).length > 0 && sessionKeys[u][0] == key) {
            next();
        } else {
            es.send('NOT ALLOWED');
        }
    } else {
      res.send('NOT ALLOWED');
    }
}

app.use('/main.html', authenticate);
app.use(express.static('public_html'));
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

sessionKeys = {};

var Schema = mongoose.Schema;

var​ ​UserSchema​ ​=​ ​new​ ​Schema​({
    username​: ​String​,
    ​salt​: ​String​,
    ​hash​: ​String​,
    ​// other user's setting like font, background color 
});
var User = mongoose.model('User', UserSchema );

app.get('/login/:username/:password', (req, res) => {
    let u = req.params.username;
    let p = req.params.password;
    Account.find({username : u, password: p}).exec(function(error, results) {
        if (results.length == 1) {
            let sessionKey = Math.floor(Math.random() * 1000);
            sessionKeys[u] = [sessionKey, Date.now()];
            res.cookie("login", {username: u, key:sessionKey}, {maxAge: 20000});
            res.send('OK');
        } else {
            res.send('BAD');
        }
    });
});

app.get('/get/users/', (req, res) => {
    var allUsers = mongoose.model('User', UserSchema );
    allUsers.find({}).exec(function (error, results) {
        res.setHeader('Content-Type', 'text/plain');
        res.send(JSON.stringify(results, null, 4));
    });
});

app.post('/add/user/', (req, res) =>{
    let obj = JSON.parse(req.body.User);

    var allUsers = mongoose.model('User', UserSchema );
    allUsers.find({username: obj.username}).exec(function (error, results) {
        if(results.length > 0) {
            res.end('user exists');
        } else {
            var user = new User(obj);
            user.save(function (err) { if (err) console.log('add user fail'); });
            res.end('user added!!');
        }
    });
});

app.get('/testcookies', (req, res)=>{
    res.send(req.cookies);
});



// function updateSessions() {
//     console.log('session update function');
//     let now = Date.now();
//     for (e in sessionKeys) {
//         if (sessionKeys[e][1] < (now - 20000)) {
//             delete sessionKeys[e];
//         }
//     }
// }  
// setInterval(updateSessions, 2000);

app.listen(port, () => 
    console.log(`App listening at http://localhost:${port}`));