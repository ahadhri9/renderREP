const express = require('express')
const app = express()
app.use(express.json())


app.all("/*", (req, res) => {
  const msg = {
    protocol: req.protocol,
    method: req.method,
    ip: req.ip,
    hostname: req.hostname,
    path: req.path,
    url: req.url,
    query: req.query,
    params: req.params,
    body: req.body,
  }
    res.send(msg);
    console.log(msg)
  });
  
  
  app.listen(3000, () => console.log("Listening on port 3000"));