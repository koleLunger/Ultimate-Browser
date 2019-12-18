const express = require('express'); //Load express framework module
const app = express(); //create an instance of express named "app"
const path = require('path'); //create an instance of the express direcrory handler
const request = require('request'); // For making API requests

const bodyParser = require('body-parser'); //Parses data from http request bodies
//Set up bodyParser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//Set up PUG view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static("public"));

const serveraddress = '192.168.106.1'
app.listen(3000, function() {
  console.log('Listening on port ' + 3000 + '.');
});

app.get('/', function(req, res, err) {
  let options = {
    url: 'https://api.github.com/repos/Yadi202/Ultimate-Browser',
    headers: {
      'User-Agent': 'request'
    }
  };

  request(options, function(request_err, request_res, request_body) {
    let jsonstuff = JSON.parse(request_body)
    res.status(200).render('index', {gitURL: jsonstuff})
  })
});

app.post('/search', function(req, res, err) {
  request('https://'+serveraddress+'/api/v0/fighter/search/' + req.body.search, function(request_err, request_res, request_body) {
    if (request_err || request_res.statusCode != 200) {
      res.send("Oops! There was a problem with the request module: <br>" + request_err);
    } else if (request_body == "undefined") {
      res.send("Oops! Server had no fighters!");
    } else {
      res.status(200).render('listfighters', {
        list: JSON.parse(request_body)
      });
    }
  })
});

app.get('/list/fighters', function(req, res, err) {
  request('https://'+serveraddress+'/api/v0/fighter/list/', function(request_err, request_res, request_body) {
    if (request_err || request_res.statusCode != 200) {
      res.send("Oops! There was a problem with the request module: <br>" + request_err);
    } else if (request_body == "undefined") {
      res.send("Oops! Server h ad no fighters!");
    } else {
      res.status(200).render('listfighters', {
        list: JSON.parse(request_body)
      });
    }
  })
});

app.get('/list/players', function(req, res, err) {
  request('https://'+serveraddress+'/api/v0/player/list', function(request_err, request_res, request_body) {
    if (request_err || request_res.statusCode != 200) {
      res.send("Oops! There was a problem with the request module: <br>" + request_err);
    } else if (request_body == "undefined") {
      res.send("Oops! Server had no players!");
    } else {
      res.status(200).render('listplayers', {
        list: JSON.parse(request_body)
      });
    }
  })
});

app.get('/player/:player', function(req, res, err) {
  request('https://'+serveraddress+'/api/v0/player/show/' + req.params.player, function(request_err, request_res, request_body) {
    if (request_err || request_res.statusCode != 200) {
      res.send("Oops! There was a problem with the request module: <br>" + request_err);
    } else if (request_body == "undefined") {
      res.send("Oops! Server didn't find that player in the database: <br>" + req.params.player);
    } else {
      res.status(200).render('listfighters', {
        list: JSON.parse(request_body)
      });
    }
  })
});

app.get('/fighter/:fighterUID', function(req, res, err) {
  request('https://'+serveraddress+'/api/v0/fighter/show/' + req.params.fighterUID, function(request_err, request_res, request_body) {
    if (request_err || request_res.statusCode != 200) {
      res.send("Oops! There was a problem with the request module: <br>" + request_err);
    } else if (request_body == "undefined") {
      res.send("Oops! Server didn't find that fighter in the database: <br>" + req.params.fighterUID);
    } else {
      res.status(200).render('fighter', JSON.parse(request_body));
    }
  })
});

app.get('/add/', function(req, res, err) {
  res.status(200).render('add');
});

app.post('/add/', function(req, res, err) {
  request.post('https://'+serveraddress+'/api/v0/fighter/add/,' {
    form: {
      fightername: req.body.fightername,
      player_name: req.body.player_name
    }
  }, function(request_err, request_res, request_body) {
    if (request_res.statusCode == 201) {
      res.status(200).redirect("/fighter/" + req.body.fighterID);
    } else if (request_res.statusCode == 403) {
      res.status(200).redirect("/fighter/" + req.body.fighterID);
    } else {
      res.send("Error!")
    }
  })
});
