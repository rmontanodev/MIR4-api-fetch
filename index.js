const axios = require('axios');
var fs = require('fs');
var async = require("async");

var page_exist = true
var page = 1
var chars_info = []


async function main (){
    var chars = await getAllChars()
    var chars_info = await getAllCharsInfo(chars)
    var json_chars = JSON.stringify(chars_info)
    fs.writeFile ("mir4-acc-market.json", json_chars, function(err) {
        if (err) throw err;
        else{
            console.log("MIR4-MARKET-ACC-UPDATED")
            return json_chars
        }
        }
    );
}
async function getAllCharsInfo(chars){
    return new Promise(async (resolve)=>{
        async.eachOfLimit(chars, chars.length, getInfoFromChar, function (err) {
            if (err) throw err;
            else{
                resolve(chars_info)
            }
        });
        
    })
}
async function getInfoFromChar(char,index,callback){
            let url_char_base = "https://www.xdraco.com/nft/trade/"
            let transportID = char.transportID 
            let skills_tier = await getSkillsTier(transportID,char.class)
            let spirits = await getSpirits(transportID)
            let codex = await getCodex(transportID)
            let training = await getTrainig(transportID)
            let inventory = await getInventory(transportID)
            chars_info.push({
                    url:url_char_base+char.seq,
                    class:char.class,
                    lvl:char.lv,
                    power:char.powerScore,
                    price:char.price,
                    skillsTier:skills_tier,
                    spirits: spirits,
                    codex:codex,
                    training:training,
                    inventory:inventory,
            })
           // console.log(`Char ${index} info done`)
            callback
}
async function getAllChars(){
    var arr_chars = []
    do{
        //console.log("perra "+page)
        let endpoint_URL = "https://webapi.mir4global.com/nft/lists?listType=sale&class=0&levMin=0&levMax=0&powerMin=0&powerMax=0&priceMin=0&priceMax=0&sort=latest&languageCode=en&page="+page;
        await axios.get(endpoint_URL).then((info)=>{
            page_info = info.data.data;
            if(page_info.more == 0){
                page_exist = false;
            }
            if(page_info.lists.length > 0){
                page_info.lists.forEach(element => {
                    arr_chars.push(element)
              });
            }
        })
        page++;
    }while(page_exist)
    return arr_chars
}

function getSkillsTier(transportID,clase){
    return new Promise(async (resolve)=>{
        var endpoint = "https://webapi.mir4global.com/nft/character/skills?transportID="+transportID+"&class="+clase+"&languageCode=en"
        await axios.get(endpoint).then((info)=>{
            page_info = info.data.data;
            resolve(page_info)
        })
    })
    
}
async function getSpirits(transportID){
    return new Promise(async (resolve)=>{
        var endpoint = "https://webapi.mir4global.com/nft/character/spirit?transportID="+transportID+"&languageCode=en"
        await axios.get(endpoint).then((info)=>{
            page_info = info.data.data;
            resolve(page_info)
        })
    })

}
async function getTrainig(transportID){
    return new Promise(async (resolve)=>{
        var endpoint = "https://webapi.mir4global.com/nft/character/training?transportID="+transportID+"&languageCode=en"
        await axios.get(endpoint).then((info)=>{
            page_info = info.data.data;
            resolve(page_info)
        })
    })

}
async function getCodex(transportID){
    return new Promise(async (resolve)=>{
        var endpoint = "https://webapi.mir4global.com/nft/character/codex?transportID="+transportID+"&languageCode=en"
        await axios.get(endpoint).then((info)=>{
            page_info = info.data.data;
            resolve(page_info)
        })
    })

}
async function getInventory(transportID){
    return new Promise(async (resolve)=>{
        var endpoint = "https://webapi.mir4global.com/nft/character/inven?transportID="+transportID+"&languageCode=en"
        await axios.get(endpoint).then((info)=>{
            page_info = info.data.data;
            let stones = getImportantMagicStones(page_info)
            resolve(stones)
        })
    })

}
function getImportantMagicStones(page_info){
    var arr = []
    arr["Epic_XP_STONE"] = 0
    arr["Legendary_Stone"] = 0
    var epic_xp_stone = "Epic Magic Stone of Growth";
    var regex_legendary_stone = /[L] Magic Stone/g
    var regex_legendary_stone1 = /Legendary Magic Stone/g
    page_info.forEach((item)=>{
        if(item.itemName == epic_xp_stone){
            arr["Epic_XP_STONE"]++;
        }
        else if(regex_legendary_stone.test(item.itemName) || regex_legendary_stone1.test(item.itemName)){
            arr["Legendary_Stone"]++;
        }
    })
    return {"Epic_XP_STONE":arr["Epic_XP_STONE"],"Legendary_Stone":arr["Legendary_Stone"]};
}
async function getMagicStones(transportID){
    return new Promise(async (resolve)=>{
        var endpoint = "https://webapi.mir4global.com/nft/character/magicstone?transportID="+transportID+"&languageCode=en"
        await axios.get(endpoint).then((info)=>{
            page_info = info.data.data;
            resolve(page_info)
        })
    })
}
main()