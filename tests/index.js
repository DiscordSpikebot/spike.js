let { getLyrics, getGuildData } = require('../dist/index')
async function find() {
  let lyrics = await getLyrics('on my way')
  console.log(lyrics)
  let get = await getGuildData('989559473104359504')
  console.log(get)
}
find()
