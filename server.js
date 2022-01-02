const express = require('express')
const app = express()
var cp = require('child_process');
var mysql      = require('mysql');
var fs = require('fs');
var http = require('http');
const res = require('express/lib/response');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'mir4',
  port     : 3307
});
 
const port = 3321
connection.connect();

app.get('/refresh-market-accounts', (req, res) => {
  getInfoUpdateBD()
})

app.get('/actual-acc',(req,res)=>{
  connection.query('SELECT * FROM character_nft where sale_active = 1',
  function (error, results, fields) {
    if (error) throw error; 
    else{
      res.json(results)
  }
}); 
})

setInterval(getInfoUpdateBD,200000)

function getInfoUpdateBD(){
  console.log("refreshing accounts...")
  cp.exec('node index.js', function(err, stdout, stderr) {
    console.log(stdout)
    //var accounts = require('./mir4-acc-market.json')
    fs.readFile('./mir4-acc-market.json', 'utf8', function(err, contents) {
      if (err) {
        // we have a problem because the Error object was returned
      } else {
        var accounts = JSON.parse(contents);
            //Insert NFTS FROM MARKET
        accounts.forEach(account => {
          connection.query('INSERT INTO character_nft (class_id,price,url,power,lvl,sale_active,epic_xp,legendary_stone) VALUES(?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE sale_active=1',[account.class,account.price,account.url,account.power,account.lvl,0,account.inventory['Epic_XP_STONE'],account.inventory['Legendary_Stone']], function (error, results, fields) {
          if (error) throw error; 
          //console.log('Character_added'); 
          console.log(results)
          if(results.insertId != 0){

          
            //Insert Skills for this Char
              connection.query('INSERT INTO character_skills (character_id,skill0,skill1,skill2,skill3,skill4,skill5,skill6,skill7,skill8,skill9,skill10,skill11,skill12) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE character_id = '+results.insertId,[
                results.insertId,
                account.skillsTier[0].skillLevel,
                account.skillsTier[1].skillLevel,
                account.skillsTier[2].skillLevel,
                account.skillsTier[3].skillLevel,
                account.skillsTier[4].skillLevel,
                account.skillsTier[5].skillLevel,
                account.skillsTier[6].skillLevel,
                account.skillsTier[7].skillLevel,
                account.skillsTier[8].skillLevel,
                account.skillsTier[9].skillLevel,
                account.skillsTier[10].skillLevel,
                account.skillsTier[11].skillLevel,
                account.skillsTier[12].skillLevel ],
                function (error, results, fields) {
                  if (error) throw error; 
                  console.log('Skills Added')
            }); 
            //Insert Codex for this Char
            connection.query('INSERT INTO codex (character_id,character_progress,character_completed,reputation_progress,reputation_completed,server_progress,server_completed,time_limited,time_completed) VALUES(?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE character_id = '+results.insertId,[results.insertId,account.codex[1].inprogress,account.codex[1].completed,account.codex[2].inprogress,account.codex[2].completed,account.codex[3].inprogress,account.codex[3].completed,account.codex[4].inprogress,account.codex[4].completed],
              function (error, results2, fields) {
                if (error) throw error; 
                else{
                  console.log('character_codex enlazado')
              }
            }); 

            //Insert training for this Char
            connection.query('INSERT INTO training (character_id,constitution,muscle_strength,nine_yin,nine_yang,violet_mist,northern_profound,toad_stance,solitude_training) VALUES(?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE character_id = '+results.insertId,[results.insertId,account.training.consitutionLevel,account.training[0].forceLevel,account.training[1].forceLevel,account.training[2].forceLevel,account.training[3].forceLevel,account.training[4].forceLevel,account.training[5].forceLevel,account.training.collectName.replace('Transformation Realm Lv. ',"")],
              function (error, results2, fields) {
                if (error) throw error; 
                else{
                  console.log('Training enlazado')
              }
            });

            //Insert spirits for this Char

                account.spirits['inven'].forEach((espiritu)=>{
                  connection.query('INSERT INTO spirit (name,tier) VALUES(?,?)',[espiritu.petName,espiritu.grade],function (error, results3, fields) {
                    connection.query('INSERT INTO character_spirit (character_id,spirit_id) VALUES(?,?) ON DUPLICATE KEY UPDATE character_id = '+results.insertId,[results.insertId,results3.insertId],
                    function (error, results2, fields) {
                      if (error) throw error; 
                      else{
                        console.log('Espiritu enlazado')
                    }
                  });
                  })
                })
            }
          });
 });

//Set all sale_active NFTS saved to 0 so after we can activate the actual ones

connection.query('UPDATE character_nft SET sale_active = 0')

//Set sale_active for the actual nft market
accounts.forEach(account => {
  connection.query('UPDATE character_nft SET sale_active = 1 WHERE url = "'+account.url+'"', function (error, results, fields) {
  if (error) throw error; 
  console.log('Character sale update');
  }); 
});

//add stats of total nfts accounts
  connection.query('INSERT INTO market_nfts (nfts_quantity) VALUES('+accounts.length+')', function (error, results, fields) {
  if (error) throw error; 
    console.log('Market nfts counts updated');
  }); 

  /*cp.exec('node index.js', function(err, stdout, stderr) {
      /*connection.connect();

      connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
      if (error) throw error;
      console.log('The solution is: ', results[0].solution);
      }); 
      
      connection.end();*/
      /* var obj = JSON.parse(fs.readFileSync('mir4-acc-market.json', 'utf8'));
      console.log(obj[0])
      res.send("cuentas obtenidas")
      });
      */
      }
  });
   
  }); 
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})