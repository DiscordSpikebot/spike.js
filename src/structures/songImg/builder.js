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

class songInfoCardBuilder {
  constructor() {
    this.title = 'Song Title'
    this.thumbnail = null
    this.author = 'Song Author'
    this.duration = '1:00'
    this.arrived = null
  }
  setTitle(title) {
    this.title = title
    return this
  }
  setThumbnail(image) {
    this.thumbnail = image
    return this
  }
  setAuthor(name) {
    this.author = name
    return this
  }
  setDuration(duration) {
    this.duration = duration
    return this
  }
  setArrived(time) {
    this.arrived = time
    return this
  }
  async toAttach() {
    try {
      let { thumbnail, title, duration, author, arrived } = this
      const canvas = new Canvas(1000, 250),
        ctx = canvas.getContext('2d')
      let col = '#4E84F1'
      ctx.fillStyle = col
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
            throw new TypeError(e)
          }
          return
        })
      } else if (thumbnail === null) {
        thumbnail = 'https://cdn.discordapp.com/attachments/984516873922150410/1008284786084823050/LOGO.png'
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
        let ned
        if (arrived === null) {
          ned = duration
        } else {
          ned = arrived
        }
        const measurements = ctx.measureText(ned)
        ctx.fillStyle = '#8FB4FF'
        await this.roundRect(ctx, 400, 195 - 35, measurements.width + 30, 30, 10, true, false)
        ctx.fillStyle = '#2C2C2C'
        ctx.fillText(`${ned}`, 400 + 15, 195 + 22.5 - 35)
      } else if (duration === null) {
        duration = ''
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
module.exports = songInfoCardBuilder
