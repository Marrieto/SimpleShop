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
router.get('/', function(req, res, next) {
    let text = 'Here are all the available queries:'
    res.render('query', {text: text})
  })

/* GET users listing. */
router.get('/products', function(req, res, next) {
  connection.query('SELECT * from Product', (err, results, fields) => {
    console.log(err);
    console.log(results);
    let text = 'These are all the products availabe:'
    let title = 'Query: SELECT * from Product'
    // console.log(fields);
    res.render('queryProducts', {text: text, title: title, row: results})
  })
});

/* GET users listing. */
router.get('/orders', function(req, res, next) {
  connection.query(`Select a.SaleID, b.Name, a.SaleDate from Sale a	JOIN (select CustomerID, Name	from	Customer) b on a.CustomerID = b.CustomerID`, (err, results, fields) => {
    console.log(err);
    console.log(results);
    let text = 'These are all the products availabe:'
    let title = 'Query: Select a.SaleID, b.Name, a.SaleDate from Sale a	JOIN (select CustomerID, Name	from	Customer) b on a.CustomerID = b.CustomerID'
    // console.log(fields);
    res.render('queryOrders', {text: text, title: title, row: results})
  })
});

module.exports = router;
