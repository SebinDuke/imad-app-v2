var express = require('express');
var morgan = require('morgan');
var path = require('path');
var path = require('path');
var bodyParser = require('body-parser');

var Pool = require('pg').Pool;

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());


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
    
    var htmlTemplate = '<html><head><title>${title}</title><meta name="viewport" content="width=device-width, initial-scale=1" /><link href="/ui/style.css" re="stylesh/></head> <body><div class="container"><div><a href="/">Home</a></div><hr/><h3>${title}</h3><div>${content}</div><hr/> <h4>Comments</h4><div id="comment_form"></div><div id="comments"><center>Loading comments...</center></div></div><script type="text/javascript" src="/ui/article.js"></script></body></html>';
    return htmlTemplate;
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
