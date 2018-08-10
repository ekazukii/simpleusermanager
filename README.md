# SimpleUserManager

**Simpleusermanager** is a nodejs module for manage user with a mysql database

### Geting started
simply install simpleusermanager with npm like this
`npm install --save simpleusermanager`

Once installed you can use it by calling `require(simpleusermanager)`

### Dependencies

This project require [mysql](https://www.npmjs.com/package/mysql)

### Example

_Simple login system using express, mysql and simpleusermanager_
```js
var manager = require(simpleusermanager)
const express = require('express');
var mysql = require('mysql');

var con = mysql.createConnection({
  // Setup your mysql object
});

const app = express();
app.post('/login',function(req,res){
    var username = req.body.username, password = req.body.password
    usermanager.login(con, username, password, function(err, data) {
        if (err) throw err;
        console.log(data.id);
    });
});
```
