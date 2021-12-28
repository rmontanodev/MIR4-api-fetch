const axios = require('axios');
var fs = require('fs');
var async = require("async");

var page_exist = true
var page = 1

async function main (){
    var chars = await getAllChars()
    var chars_info = await getAllCharsInfo(chars[0])
    fs.writeFile ("mir4-acc-market.json", JSON.stringify(chars_info), function(err) {
        if (err) throw err;
        }
    );
    console.log(JSON.stringify(chars_info)) 
}
async function getAllCharsInfo(chars){
    return new Promise(async (resolve)=>{
        var chars_info = []
        for (let index = 0; index < chars.length; index++) {
            await getInfoFromChar(chars[index]).then((info)=>{
                chars_info.push(info)
                if(index == chars.length - 1){
                    resolve(chars_info)
                } 
            })
        }
    })
}
async function getInfoFromChar(char){
    let url_char_base = "https://www.xdraco.com/nft/trade/"
    return new Promise(async (resolve)=>{
            let transportID = char.transportID 
            let skills_tier = await getSkillsTier(transportID,char.class)
            let spirits = await getSpirits(transportID)
            let codex = await getCodex(transportID)
            let training = await getTrainig(transportID)
            let inventory = await getInventory(transportID)
            let magicstone = await getMagicStones(transportID)
                resolve({
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
                    magicstone:magicstone
                })
    }) 
}
async function getAllChars(){
    var arr_chars = []
    do{
        let endpoint_URL = "https://webapi.mir4global.com/nft/lists?listType=sale&class=0&levMin=0&levMax=0&powerMin=0&powerMax=0&priceMin=0&priceMax=0&sort=latest&languageCode=en&page="+page;
        await axios.get(endpoint_URL).then((info)=>{
            page_info = info.data.data;
            if(page_info.more == 0){
                page_exist = false;
            }
            else{
                arr_chars.push(page_info.lists)
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
            resolve(page_info)
        })
    })

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