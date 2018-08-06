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

exports.addMoney = function(con, money, pid) {
  id = con.escape(pid)
  sql = "SELECT money FROM users WHERE id = " + id;
  con.query(sql, function(err, results, fields) {
    if (err) throw err;
    money = results[0].money + money;
    setMoney(con, money, id)
  });
}

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
