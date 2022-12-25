const Client = require('./structures/Client')
const songInfoCard = require('./structures/songImg/normal')
const songInfoCardBuilder = require('./structures/songImg/builder')
const { Colors } = require('./utils/Color')
module.exports = {
  //classes
  Client,
  songInfoCard,
  //builders
  songInfoCardBuilder,
  //vars
  Colors
}
