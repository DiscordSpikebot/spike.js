const { Client, songInfoCard, songInfoCardBuilder } = require('../dist/index.js')
const imgcreate = new songInfoCard({
  debug: true
})
let client = new Client({
  version: 'v3'
})
async function find() {
  const img = await imgcreate.generate({
    thumbnail: 'https://cdn.discordapp.com/attachments/913885039480152144/1008433692529672232/Logo_2.png',
    title: 'e',
    author: 'e',
    duration: 'e',
    source: 'yt'
  })
  const builder = new songInfoCardBuilder()
  .setTitle('Spike')
  .toAttach();
  console.log(await (builder))
  console.log(img)
  console.log(await client.getGuildData('989559473104359504'))
  console.log(await client.getLyrics('1 day 2 nights'))
}
find()
