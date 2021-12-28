const express = require('express')
const app = express()
var cp = require('child_process');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'mir4'
});
 
const port = 3000

app.get('/refresh-market-accounts', (req, res) => {
    cp.exec('node index.js', function(err, stdout, stderr) {
        console.log(results)
        res.send(results)
      });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})