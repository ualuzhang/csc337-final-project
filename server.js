const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');
const crypto = require ('crypto');

const port = 3000;
const iterations = 1000;

const app = express();
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
app.use(cookieParser());

const db = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/final';

var Schema = mongoose.Schema;
var UserSchema = new Schema({
    username: String,
    salt: String,
    hash: String
    // color: String
});
var User = mongoose.model('User', UserSchema );

var GroupSchema = new Schema ({
    members: [String],
    message: [{type: Schema.Types.ObjectId, ref: 'Msg'}]
});

var MsgSchema = new Schema ({
    message: String,
    group: {type: Schema.Types.ObjectId, ref: 'Group'},
    from: {type: Schema.Types.ObjectId, ref: 'User'},
    to: {type: Schema.Types.ObjectId, ref: 'User'}
});

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

app.get('/login/:username/:password', (req, res) => {
    var u = req.params.username;
    User.find({username : u}).exec(function(error, results) {
        if (results.length == 1) {
            let password = req.params.password;
            var salt = results[0].salt;
            crypto.pbkdf2(password, salt, iterations, 64, 'sha512', (err, hash) => {
                if(err) throw err;
                let hStr  = hash.toString('base64');
                if(results[0].hash == hStr) {
                    let sessionKey = Math.floor(Math.random() * 1000);
                    sessionKeys[u] = [sessionKey, Date.now()];
                    res.cookie("login", {username: u, key:sessionKey}, {maxAge: 20000});
                    res.send('OK');
                } else {
                    res.send('There was an issue logging in, please try again');
                }
            });
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

app.get('/create/:username/:password/:fav', (req, res) => {
    var u = req.params.username;
    var p = req.params.password;
    var f = req.params.fav;

    console.log(u + '--------------');

    User.find({username : u}).exec(function(error, results) {
        if (results.length == 0) {
            var salt = crypto.randomBytes(64).toString('base64');
            crypto.pbkdf2(p, salt, iterations, 64, 'sha512', (err, hash) => {
                if(err) throw err;
                let hashStr = hash.toString('base64');
                var user = new User({'username': u, 'salt': salt, 'hash': hashStr});
                user.save(function (err) {if(err) console.log(err); });
                res.send('User added!');
            });
        } else {
            res.send('Username already taken');
        }
    });
});

app.post('/add/message', (req, res) => {
    
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