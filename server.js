var express = require('express');
var morgan = require('morgan');
var path = require('path');

var http = require('http');
var Pool = require('pg').Pool;

var app = express();
app.use(morgan('combined'));

var config={
    user: 'sebinduke',
    database: 'sebinduke',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD,
    
};

var pool= new Pool(config);

app.get('/test-db',function(req,res){
    pool.query('SELECT * FROM usertable',function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else
        {
            res.send(JSON.stringify(result.rows));    
        }
    });
});

function createTemplate(data){
    var title = data.title;
    var con = data.content;
    
    var HtmlTemp = "<html> <head> <link href='/ui/style.css' rel='stylesheet' /></head><body bgcolour='gray'><div class='container'><center><h1>" +${title}+" </h1><hr>" +${con}+" </center></div></body></html>";
    return HtmlTemp;
}

app.get('/article/:anm', function(req,res){
    
    pool.query("SELECT * FROM article WHERE title = ($1);",[req.params.anm],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else
        {
            if(result.rows.length === 0){
                result(status(404),send("Article requested does not exist."));
            }
            else{
                var ArticleData =result.rows[0];
                res.send(createTemplate(ArticleData));
                //res.send(JSON.stringify(result));   
            }
        }
        //res.send(req.params.anm);
    });
    
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
