const {Client} = require('../dist/index.js')
const {songInfoCard} = require('../dist/index.js')
const img = new songInfoCard({
  thumbnail: 'https://cdn.discordapp.com/attachments/913885039480152144/1008433692529672232/Logo_2.png',
  title: 'e',
  author: 'e',
  duration: 'e',
  source: 'yt'
})
console.log(img)
let client = new Client();

async function find() {
  console.log(await client.getGuildData('989559473104359504'))
  console.log(await client.getLyrics('1 day 2 nights'))
}
find()