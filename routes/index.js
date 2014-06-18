var request = require('request');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    var meta = "http://kortforsyningen.kms.dk/service?service=META&request=GetTicket&login={Login}&password={Password}";
    request.get(meta, function (error, response, body) {
        var ticket = body;
        res.render('index', {ticket: ticket, title: 'Express' });
    });
});

module.exports = router;
