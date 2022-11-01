/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const { fetch } = require('undici')
const config = require('../config.json')
const songInfoCard = require('../structures/songImg')
class Client {
  constructor(options = { version }) {
    // eslint-disable-line
    let version = options.version
    if (!version) {
      throw new Error('Specify and API version.')
    } else if (!version === 'v2' || !version === 'v3') {
      throw new Error('Specify a valid API version.')
    }
    this.version = version
  }
  async getLyrics(song, service) {
    let needed = 'genius' || 'finder'
    if (service === undefined || service !== needed) {
      service = 'genius'
    }
    if (song === undefined) {
      throw new Error('Please provide a song.')
    }
    let get = await fetch(`${config.baseURL}/${this.version}/lyrics/${service}/${song}`)
    let resp = await get.text()
    let res = JSON.parse(resp)
    return res
  }
  async getGuildData(id) {
    let conditions = '1' || '2' || '3' || '4' || '5' || '6' || '7' || '8' || '9' || '0'
    let param = `${id}`
    if (id === Number) {
      throw new Error('The ID you have provided is NOT put in the string form.')
    } else if (param === undefined) {
      throw new Error('Please provide a guild ID.')
    } else if (!param.includes(conditions)) {
      throw new Error('The ID you have provided is invalid')
    }
    let url
    if (this.version === 'v2') {
      url = `${config.baseURL}/v2/data`
      let get = await fetch(`${url}/${id}`)
      let resp = await get.text()
      let parse = JSON.parse(resp)
      let role = parse.role
      return role
    } else if (this.version === 'v3') {
      url = `${config.baseURL}/v3/data/guilds`
    }
    let get = await fetch(`${url}/${id}`)
    let success
    if (get.status !== 200) {
      success = false
    }
    let resp = await get.text()
    let res = JSON.parse(resp)
    success = res.success
    let role = res.role
    let channel = res.channel
    return {
      success,
      role,
      channel
    }
  }
  async canvas(thumbnail, title, duration, author) {
    const songCardUtil = new songInfoCard({
      debug: false
    })
    const attachment = await songCardUtil.generate({
      thumbnail: thumbnail,
      title: title,
      author: author,
      duration: duration,
      source: 'yt'
    })
    return attachment
  }
}
module.exports = Client
