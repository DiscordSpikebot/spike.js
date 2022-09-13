const fetch = require('node-fetch')
const config = require('./config.json')

async function getLyrics(song, service) {
  let needed = 'genius' || 'finder'
  if (service === undefined || service !== needed) {
    service = 'genius'
  }
  if (song === undefined) {
    throw new Error('Please provide a song.')
  }
  let get = await fetch(`${config.baseURL}/v3/lyrics/${service}/${song}`)
  let resp = await get.text()
  let res = JSON.parse(resp).lyrics
  return res
}

async function getGuildData(id) {
  let conditions = '1' || '2' || '3' || '4' || '5' || '6' || '7' || '8' || '9' || '0'
  let param = `${id}`
  if (id === Number) {
    throw new Error('The ID you have provided is NOT put in the string form.')
  } else if (param === undefined) {
    throw new Error('Please provide a guild ID.')
  } else if (!param.includes(conditions)) {
    throw new Error('The ID you have provided is invalid')
  }
  let get = await fetch(`${config.baseURL}/v3/data/guilds/${id}`)
  let resp = await get.text()
  let res = JSON.parse(resp)
  let role = res.role
  let channel = res.channel
  return {
    role,
    channel
  }
}
module.exports = { getLyrics, getGuildData }
