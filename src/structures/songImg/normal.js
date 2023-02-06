const { Canvas, Image } = require('canvas')
const { request } = require('undici')
const applyText = (canvas, text) => {
  const context = canvas.getContext('2d')

  // Declare a base size of the font
  let fontSize = 40

  do {
    // Assign the font to the context and decrement it so it can be measured again
    context.font = `${(fontSize -= 10)}px bold`
    // Compare pixel width of the text to the canvas minus the approximate avatar size
  } while (context.measureText(text).width > canvas.width - 300)

  // Return the result to use in the actual canvas
  return context.font
}

class songInfoCard {
  constructor({ debug } = {}) {
    this.allSources = [
      {
        name: 'SC',
        aliases: ['soundcloud'],
        text: 'Soundcloud',
        url: 'https://cdn.discordapp.com/emojis/988453864565014538.png',
        img: new Image()
      },
      {
        name: 'SP',
        aliases: ['spotify'],
        text: 'Spotify',
        url: 'https://cdn.discordapp.com/emojis/988453862841122909.png',
        img: new Image()
      },
      {
        name: 'YT',
        aliases: ['youtube'],
        text: 'Youtube',
        url: 'https://cdn.discordapp.com/emojis/988453865802330192.png',
        img: new Image()
      },
      {
        name: 'YTM',
        aliases: ['musicyoutube', 'youtubemusic', 'music youtube'],
        text: 'Youtube Music',
        url: 'https://cdn.discordapp.com/emojis/988786012505374761.png',
        img: new Image()
      },
      {
        name: 'applemusic',
        aliases: ['am', 'musicapple', 'apple music', 'music apple'],
        text: 'AppleMusic',
        url: 'https://cdn.discordapp.com/emojis/1018176501335740436.png',
        img: new Image()
      },
      {
        name: 'bandcamp',
        aliases: ['bc'],
        text: 'Bandcamp',
        url: 'https://cdn.discordapp.com/emojis/1018175632347234414.png',
        img: new Image()
      },
      {
        name: 'deezer',
        aliases: ['dz'],
        text: 'Deezer',
        url: 'https://cdn.discordapp.com/emojis/1018174807092760586.png',
        img: new Image()
      },
      {
        name: 'reddit',
        aliases: ['rd'],
        text: 'Reddit',
        url: 'https://cdn.discordapp.com/emojis/1018185730410950697.png',
        img: new Image()
      },
      {
        name: 'twitch',
        aliases: ['tw'],
        text: 'Twitch',
        url: 'https://cdn.discordapp.com/emojis/1018174515655749643.png',
        img: new Image()
      },
      {
        animated: false,
        name: 'vimeo',
        id: '1018175316075761755',
        url: 'https://cdn.discordapp.com/emojis/1018175316075761755.png',
        img: new Image()
      },
      {
        name: 'DC',
        id: '988722811642200064',
        aliases: ['discord'],
        text: 'Discord-Local',
        url: 'https://cdn.discordapp.com/emojis/988722811642200064.png',
        img: new Image()
      }
    ]
    this.mark = new Image()
    this.init()
    this.debug = debug ?? true
  }
  /**
   * Initalize The Images
   */
  async init() {
    if (this.debug) console.log('initalizing currentSongInfoCard')
    if (this.debug) console.log('currentSongInfoCard initated')
  }
  /**
   * Generate a Card
   * @param { {thumbnail:string, title:string, duration:string, author:string, source:string} } inputData
   * @returns {ArrayBuffer} Image Buffer
   */
  async generate(inputData = {}) {
    try {
      const { thumbnail, title, duration, author } = inputData
      const canvas = new Canvas(1000, 250),
        ctx = canvas.getContext('2d')
      ctx.fillStyle = '#4E84F1'
      await this.roundRect(ctx, 0, 0, canvas.width, canvas.height, 25, true, false)
      if (thumbnail) {
        const dWidth = 355.5555555555556
        const dHeight = 200
        await this.roundRect(ctx, 25, 25, dWidth - 50, dHeight, 15, false, true, async () => {
          try {
            let img = new Image()
            const { body } = await request(thumbnail)
            img.src = Buffer.from(await body.arrayBuffer()) // eslint-disable-line
            ctx.drawImage(img, 25, 25, dWidth - 50, dHeight)
          } catch (e) {
            throw new Error(e)
          }
          return
        })
      }
      if (title) {
        ctx.fillStyle = '#FFFFFF'
        ctx.font = applyText(canvas, title)
        ctx.fillText(title, 400, 25 + 30 + 35, canvas.width - 25)
      }
      if (author) {
        ctx.fillStyle = '#2C2C2C'
        ctx.font = '20px bold'
        ctx.fillText(author, 400, 75 + 10 + 35, canvas.width - 25)
      }
      if (duration) {
        ctx.font = '25px bold'
        const measurements = ctx.measureText(duration)
        ctx.fillStyle = '#8FB4FF'
        await this.roundRect(ctx, 400, 195 - 35, measurements.width + 30, 30, 10, true, false)
        ctx.fillStyle = '#2C2C2C'
        ctx.fillText(duration, 400 + 15, 195 + 22.5 - 35)
      }
      return await canvas.toBuffer('image/png')
    } catch (e) {
      console.log(e)
    }
  }
  /**
   * Create a rounded Rectangle
   * @param {*} ctx
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {number} [radius]
   * @param {boolean} [fill]
   * @param {boolean} [stroke]
   * @param {Function} [callback]
   * @returns {boolean}
   */
  async roundRect(ctx, x, y, width, height, radius = 5, fill = false, stroke = true, callback) {
    ctx.save()
    if (typeof radius === 'number') {
      radius = { tl: radius, tr: radius, br: radius, bl: radius }
    } else {
      radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius }
    }
    ctx.beginPath()
    ctx.moveTo(x + radius.tl, y)
    ctx.lineTo(x + width - radius.tr, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
    ctx.lineTo(x + width, y + height - radius.br)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
    ctx.lineTo(x + radius.bl, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
    ctx.lineTo(x, y + radius.tl)
    ctx.quadraticCurveTo(x, y, x + radius.tl, y)
    ctx.closePath()
    if (callback) await callback(ctx)
    if (fill) ctx.fill()
    if (stroke) ctx.stroke()
    ctx.restore()
    return true
  }
}
module.exports = songInfoCard
