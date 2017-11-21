const express = require('express');
const bodyParser = require ('body-parser');
const morgan = require ('morgan');
//const path = require ('path');

const app = express ();


//app.use (express.static(path.join(__dirname, '..', 'public')))
app.use (express.static(__dirname+'/../public'));
app.use (bodyParser.json());
app.use (morgan ("dev"));

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/../public/index.html')
})

// catch 404 (i.e., no route was hit) and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // handle all errors (anything passed into `next()`)
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.error(err);
    res.sendFile(__dirname+'/../public/error.html');
  });

  app.listen(3000, () => {
      console.log('Up and running');
  })

