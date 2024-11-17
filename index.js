// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.use('/api', (req, res, next)=> {
  req.time = new Date();
  next();
})

app.get('/api', (req, res) => {
  const time = req.time.toUTCString();
  const unix = req.time.getTime();
  res.json({"unix": unix,"utc": time});
})

app.get('/api/:date', (req, res) => {
    const inputDate = req.params.date;
    let date;
    if (!isNaN(inputDate)) {
      date = new Date(parseInt(inputDate));
    } else {
      // Otherwise, treat it as a date string
      date = new Date(inputDate);
    }

    if (isNaN(date.getTime())) {
      return res.json({ error: "Invalid Date" });
    }

    res.json({ "unix": date.getTime(), "utc": date.toUTCString() });
    
    /*
    IF PARAM === VALIDDATE || PARAM === VALIDUNIX     
    RETURN JSON(UTC, UNIX)
    ELSE  
    RETURN JSON({ error : "Invalid Date" })

    */
})



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
