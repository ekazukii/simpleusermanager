const crypto = require('crypto');

exports.login = function(con, username, password, callback) {
  const hash = crypto.createHash('sha256');
  hash.update(con.escape(escapeHtml(password)));

  var username = con.escape(escapeHtml(username));
  var cryptedPass = con.escape(escapeHtml(hash.digest('hex')));

  var sql = "SELECT * FROM users WHERE username = "+username+" AND password = "+ cryptedPass;
  con.query(sql, function(err, results, fields) {
      if (err) callback(err);
      if (results[0] == undefined) {
        callback(err, "Username or login false");
      } else {
        var data = results[0]
        callback(err, data);
      }
  });
}

exports.register = function(con, username, password, email, callback) {
  const hash = crypto.createHash('sha256');
  hash.update(con.escape(escapeHtml(password)));

  var username = con.escape(escapeHtml(username));
  var email = con.escape(escapeHtml(email));
  var cryptedPass = con.escape(escapeHtml(hash.digest('hex')));

  var sql = "INSERT INTO users (username, password, email) VALUES ("+username+", "+cryptedPass+", "+ email+")";
  con.query(sql, function (error, results, fields) {
      if (error) {
        if (error.code == 'ER_DUP_ENTRY') {
          callback(error);
        } else {
          throw error;
        }
      } else {
        callback(error, true);
      }
  });
}

exports.pay = function(con, money, sender, receiver, callback) {
  var sql1 = "SELECT money FROM users WHERE id = " + con.escape(sender);

  con.query(sql1, function(err, senderData, fields) {
    if (err) throw err;
    if (senderData[0] != undefined) {
      if (senderData[0].money > money) {
        var newSenderMoney = senderData[0].money - money;
        setMoney(con, newSenderMoney, sender);
        addMoney(con, money, receiver);
        callback(undefined);
      } else {
        callback("Sender dosen't have enought money");
      }
    } else {
      callback('User does not exist');
    }
    /*money = results[0].money + money;
    setMoney(con, money, id);
    setMoney(con, money, )*/
  });
}
exports.getUserIdByUsername = function(con, username, callback) {
  username = con.escape(escapeHtml(username));
  sql = "SELECT id FROM users WHERE username = " + username;
  con.query(sql, function(err, results, fields) {
    if (err) throw err;
    if (results[0] != undefined) {
      callback(undefined, results[0].id)
    } else {
      callback('User does not exist');
    }
  });
}

function addMoney(con, money, pid) {
  id = con.escape(pid);
  sql = "SELECT money FROM users WHERE id = " + id;
  con.query(sql, function(err, results, fields) {
    if (err) throw err;
    money = parseInt(results[0].money) + parseInt(money);
    setMoney(con, money, id)
  });
}

exports.addMoney = function(con, money, pid) {
  id = con.escape(pid);
  sql = "SELECT money FROM users WHERE id = " + id;
  con.query(sql, function(err, results, fields) {
    if (err) throw err;
    money = results[0].money.toString() + money.toString();
    setMoney(con, money, id)
  });
};

function setMoney(con, money, id) {
  sql = "UPDATE users SET money = " + con.escape(money) + " WHERE id = " + id;
  con.query(sql, function (err, results, fields) {
    if (err) throw err;
  });
}

function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
