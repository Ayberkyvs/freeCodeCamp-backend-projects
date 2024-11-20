require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const Url = require('./models/url');

// Basic Configuration
const port = process.env.PORT || 3000;
connectDB();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/shorturl/:shorturl', async (req, res)=>{
  req.params.shorturl
  try {
    const matchUrl = await Url.findOne({short_url: req.params.shorturl})
    if (!matchUrl) {
      res.status(404).json({error: 'URL Not Found. May be Deleted'})
    }else {
      res.redirect(matchUrl.original_url)
    }
  }catch(err) {
    res.status(500).json({error: err.message})
  }

})
app.post('/api/shorturl', async (req, res) => {
  const invalidURL = { error: 'Invalid URL' };
  try {
    const urlObj = new URL(req.body.url);
    dns.lookup(urlObj.hostname, { all: true }, async (err) => {
      if (err) {
        return res.json(invalidURL);
      }
      const result = await checkSavedUrl(req.body.url);
      res.json(result);
    });
  } catch (e) {
    return res.json(invalidURL);
  }
});


const checkSavedUrl = async (url) => {
  const matchedUrl = await Url.findOne({original_url: url});
  console.log('matched url', matchedUrl);
  if (matchedUrl?.short_url) {
    return {'original_url':matchedUrl.original_url, 'short_url': matchedUrl.short_url}
  }
  return createAndSaveUrl(url);
}

const createAndSaveUrl = async (url) => {
  let short_url_index = await Url.countDocuments();
  short_url_index++;
  const newUrl = new Url({
    original_url: url,
    short_url: short_url_index
  })
  const savedUrl = await newUrl.save();
  console.log('saved url:', savedUrl)
  return savedUrl;
}

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
}); 