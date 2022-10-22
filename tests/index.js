const Client = require('../dist/index.js')
let client = new Client();

async function find() {
  console.log(await client.getGuildData('989559473104359504'))
  console.log(await client.getLyrics('1 day 2 nights'))
}
find()