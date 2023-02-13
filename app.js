const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
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
  //AAE1E1E1E


app.listen(port, () => console.log(`Example app listening on port ${port}!`));



  
  