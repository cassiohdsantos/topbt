// https://github.com/Nobuyaki
// Jangan Hapus link githubnya bang :)

const fetch = require('node-fetch')
let handler = async (m, { conn, usedPrefix }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw `Envie n legenda ou marque a imagem com o comando ${usedPrefix}qanime`
  if (!/image\/(jpe?g|png)/.test(mime)) throw `Formato ${mime} não suportado`
  let img = await q.download()
  await m.reply('Procurando entre milhares de títuos...')
  let anime = `data:${mime};base64,${img.toString('base64')}`
  let response = await fetch('https://trace.moe/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image: anime }),
  })
  if (!response.ok) throw 'Imagem não reconhecida.'
  let result = await response.json()
  let { is_adult, title, title_chinese, title_romaji, episode, season, similarity, filename, at, tokenthumb, anilist_id } = result.docs[0]
  let link = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`
  let nobuyaki = `
${similarity < 0.89 ? 'Não tenho certeza se está correto.' : ''}

❏ Título em japonês: *${title}*
❏ Título: *${title_romaji}*
❏ Similaridade: *${(similarity * 100).toFixed(1)}%*
❏ Episódio: *${episode.toString()}*
❏ Ecchi: *${is_adult ? 'Sim' : 'Não'}*
`.trim()
  conn.sendFile(m.chat, link, 'srcanime.mp4', `${nobuyaki}`, m)
}
handler.help = ['qanime (legenda|marque)']
handler.tags = ['tools']
handler.command = /^(qanime)$/i
handler.group = true

module.exports = handler
