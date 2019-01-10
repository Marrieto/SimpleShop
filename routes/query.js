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

// /* GET users listing. */
// router.get('/orders', function(req, res, next) {
//   connection.query(`Select a.SaleID, b.Name, a.SaleDate from Sale a	JOIN (select CustomerID, Name	from	Customer) b on a.CustomerID = b.CustomerID`, (err, results, fields) => {
//     console.log(err);
//     console.log(results);
//     let text = 'These are all the products availabe:'
//     let title = 'Query: Select a.SaleID, b.Name, a.SaleDate from Sale a	JOIN (select CustomerID, Name	from	Customer) b on a.CustomerID = b.CustomerID'
//     // console.log(fields);
//     res.render('queryOrders', {text: text, title: title, row: results})
//   })
// });

/* GET users listing. */
router.get('/orders', function(req, res, next) {
  connection.query(`Select e.SaleID, d.Name, Sum(e.Qty * e.Price) AS 'TotalPerOrder', c.SaleDate from Sale c JOIN ( select CustomerID, Name from Customer ) d on d.CustomerID=c.CustomerID JOIN ( select a.Qty, a.ProductID, a.SaleID, b.Name, b.Price from LineItem a JOIN ( select * from Product ) b on b.ProductID=a.ProductID ) e on e.SaleID=c.SaleID group by e.SaleID`, (err, results, fields) => {
    console.log(err);
    console.log(results);
    let text = 'These are all the products availabe:'
    let title = 'Query: Select e.SaleID, d.Name, Sum(e.Qty * e.Price) AS `Total per order`, c.SaleDate from Sale c JOIN ( select CustomerID, Name from Customer ) d on d.CustomerID=c.CustomerID JOIN ( select a.Qty, a.ProductID, a.SaleID, b.Name, b.Price from LineItem a JOIN ( select * from Product ) b on b.ProductID=a.ProductID ) e on e.SaleID=c.SaleID group by e.SaleID'
    // console.log(fields);
    res.render('queryOrders', {text: text, title: title, row: results})
  })
});

/* GET users listing. */
router.get('/order', function(req, res, next) {
  connection.query(`SELECT a.Qty,	b.Name, b.Price,	SUM(a.Qty * b.Price) as Total FROM LineItem a	JOIN (SELECT	ProductID,	Name,	Price	From	Product	) b on a.ProductID = b.ProductID WHERE	SaleID = 2 group by	a.ProductID`, (err, results, fields) => {
    console.log(err);
    console.log(results);
    let text = 'This is the name of the product + total price of a specific order, in this case the first order made (SaleID=2)'
    let title = 'Query: SELECT a.Qty,	b.Name, b.Price,	SUM(a.Qty * b.Price) as Total FROM LineItem a	JOIN (SELECT	ProductID,	Name,	Price	From	Product	) b on a.ProductID = b.ProductID WHERE	SaleID = 2 group by	a.ProductID'
    // console.log(fields);
    res.render('queryOrder', {text: text, title: title, row: results})
  })
});

/* GET users listing. */
router.get('/orderTotal', function(req, res, next) {
  connection.query(`select sum(c.Total) as TotalSum from (SELECT 	a.Qty, 	b.Name, b.Price, 	SUM(a.Qty * b.Price) as Total FROM 	LineItem a JOIN (	SELECT 	ProductID, Name, Price 	From 	Product) b on a.ProductID = b.ProductID WHERE SaleID = 2 group by	a.ProductID	) c`, (err, results, fields) => {
    console.log(err);
    console.log(results);
    let text = 'This is the name of the product + total price of a specific order, in this case the first order made (SaleID=2)'
    let title = 'Query: select sum(c.Total) as TotalSum from (SELECT 	a.Qty, 	b.Name, b.Price, 	SUM(a.Qty * b.Price) as Total FROM 	LineItem a JOIN (	SELECT 	ProductID, Name, Price 	From 	Product) b on a.ProductID = b.ProductID WHERE SaleID = 2 group by	a.ProductID	) c'
    // console.log(fields);
    res.render('queryOrderTotal', {text: text, title: title, row: results})
  })
});

/* GET users listing. */
router.get('/orderTotalCompany', function(req, res, next) {
  connection.query(`Select d.Name, Sum(e.Qty * e.Price) AS 'TotalPerCompany' from Sale c JOIN ( select CustomerID, Name from Customer ) d on d.CustomerID=c.CustomerID JOIN ( select a.Qty, a.ProductID, a.SaleID, b.Name, b.Price from LineItem a JOIN ( select * from Product ) b on b.ProductID=a.ProductID ) e on e.SaleID=c.SaleID group by d.CustomerID`, (err, results, fields) => {
    console.log(err);
    console.log(results);
    let text = 'This is the total sum of all the orders made by all companies'
    let title = 'Query: Select d.Name, Sum(e.Qty * e.Price) AS `TotalPerCompany` from Sale c JOIN ( select CustomerID, Name from Customer ) d on d.CustomerID=c.CustomerID JOIN ( select a.Qty, a.ProductID, a.SaleID, b.Name, b.Price from LineItem a JOIN ( select * from Product ) b on b.ProductID=a.ProductID ) e on e.SaleID=c.SaleID group by d.CustomerID'
    // console.log(fields);
    res.render('queryOrderTotalCompany', {text: text, title: title, row: results})
  })
});

module.exports = router;
