const express = require("express");

const app = express();
const port = 3000;
const path = require('path');



var hbs = require('express-hbs');

// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'news'
});

connection.connect();





app.get('/', (req, res) => {
  const query = 'SELECT * FROM actualites ORDER BY date DESC';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des actualités : ', err);
      res.status(500).send('Erreur serveur');
    } else {
      res.render('home', { news: results });
    }
  });
});



app.get("/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views/add.html"));
});

app.get("/addnews", function(req, res) {
    var untitre = req.query.letitre;
    var unedesc = req.query.ladescription;
    var sql = "insert into actualites(titre, description) values(?, ?)"
    
    connection.query(sql, [untitre, unedesc], function(error, results, fields) {
        res.send(results)
    })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
