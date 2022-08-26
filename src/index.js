const fetch = require('node-fetch')
const config = require('./config.json')

 async function getLyrics(song, service){
  let needed = 'genius' || 'finder'
    if(service === undefined ||service === !needed ){
        service = 'genius'
    }
    if(song === undefined){
        throw new Error("Please provide a song.")
    }
    let get = await fetch(`${config.baseURL}/v3/lyrics/${service}/${song}`)
    let resp = await get.text()
    let res = JSON.parse(resp).lyrics
    return res
  }

  async function getGuildData(id){
    if(id === !Number ){
        throw new Error("The ID you have provided is NOT a number")
    }else if(id === undefined){
        throw new Error("Please provide a guild ID.")
    }
    let get = await fetch(`${config.baseURL}/v3/data/guilds/${id}`)
    let resp = await get.json()
    let res = JSON.parse(JSON.stringify(resp))
    let res1 = res.role
    let res2 = res.channel
    return {
       res1,
       res2 
    }
  }
module.exports = {getLyrics, getGuildData}