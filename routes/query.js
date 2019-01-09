var express = require('express');
var router = express.Router();
const mysql = require('mysql')


let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

connection.connect((err, res) => {
  console.log(err);
  console.log(res);
})

/* GET users listing. */
router.get('/products', function(req, res, next) {
  connection.query('SELECT * from Product', (err, results, fields) => {
    console.log(err);
    console.log(results);
    let text = 'These are all the products availabe:'
    let title = 'SELECT * from Product'
    // console.log(fields);
    res.render('queryProducts', {text: text, title: title, row: results})
  })
  
});

module.exports = router;
