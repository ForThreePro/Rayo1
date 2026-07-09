import fs from 'fs'
import os from 'os'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)
import fetch from 'node-fetch';

const isUrl = (text) => /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^\s]+$/i.test(text)

// Función para barra de carga
const loadingBar = (p) => {
    const full = 10
    const filled = Math.round(full * p / 100)
    const empty = full - filled
    return '█'.repeat(filled) + '▒'.repeat(empty) + ` ${p}%`
}

const handler = async (m, { conn, text }) => {
  if (!text) {
    await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
    return m.reply(`
╭─ׅ─ׅ┈ ─๋︩︪─❖─๋︩︪─┈─ׅ─ׅ╮
╭╼☁️ 𝐘𝐎𝐔𝐓𝐔𝐁𝐄 𝐏𝐋𝐀𝐘 ☁️╮
┃֪࣪
├ׁ̟̇❍✎ Ingresa el nombre de la música
├ׁ̟̇❍✎ Ej: play imagine dragons
╰─ׅ─ׅ┈ ─๋︩︪─❖─๋︩︪─┈─ׅ─ׅ╯
`.trim());
  }

  let waitMsg = await conn.sendMessage(m.chat, { 
    text: `╭─ׅ─ׅ┈ ─๋︩︪─❖─๋︩︪─┈─ׅ─ׅ╮
╭╼⚡ 𝗕𝗨𝗦𝗖𝗔𝗡𝗗𝗢 ⚡╮
┃֪࣪
├ׁ̟̇❍✎ ${loadingBar(0)}
├ׁ̟̇❍✎ Buscando: ${text}
╰─ׅ─ׅ┈ ─๋︩︪─❖─๋︩︪─┈─ׅ─ׅ╯`
  }, { quoted: m });

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

  try {
    let link, title = 'YouTube', channel = '-', duration = '-', imageUrl = null

    if (isUrl(text)) {
      link = text
      const res = await fetch(`${api.url}/search/youtube?q=${encodeURIComponent(text)}&apikey=${api.key}`);
      const json = await res.json();
      if (json.status && json.result?.length) {
        const data = json.result[0]
        title = data.title
        channel = data.channel
        duration = data.duration
        imageUrl = data.imageUrl
      }
    } else {
      const res = await fetch(`${api.url}/search/youtube?q=${encodeURIComponent(text)}&apikey=${api.key}`);
      const json = await res.json();
      if (!json.status || !json.result?.length) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await conn.sendMessage(m.chat, { delete: waitMsg.key })
        return m.reply(`No se encontró: ${text}`)
      }
      const data = json.result[0]
      link = data.link
      title = data.title
      channel = data.channel
      duration = data.duration
      imageUrl = data.imageUrl
    }

    await conn.sendMessage(m.chat, { delete: waitMsg.key }) // Borra el "buscando"

    const caption = `
╭─ׅ─ׅ┈ ─๋︩︪─❖─๋︩︪─┈─ׅ─ׅ╮
╭╼☁️ 𝐘𝐎𝐔𝐓𝐔𝐁𝐄 ☁️╮
┃֪࣪
├ׁ̟̇❍✎ ❖ ${title}
├ׁ̟̇❍✎ ✿ Canal: ${channel}
├ׁ̟̇❍✎ ⏱️ Duración: ${duration}
┃֪࣪
├ׁ̟̇❍✎ 🔗 Link: ${link}
╰─ׅ─ׅ┈ ─๋︩︪─❖─๋︩︪─┈─ׅ─ׅ╯

✰ Selecciona una opción
`.trim();

    let message = {
      caption,
      buttons: [
        { buttonId: `audio_${link}`, buttonText: { displayText: '❖ AUDIO' }, type: 1 },
        { buttonId: `video_${link}`, buttonText: { displayText: '❖ VIDEO' }, type: 1 }
      ],
      headerType: 4
    }

    if (imageUrl) {
      const thumb = await (await fetch(imageUrl)).buffer()
      message.image = thumb
    }

    await conn.sendMessage(m.chat, message, { quoted: m });

  } catch (e) {
    await conn.sendMessage(m.chat, { delete: waitMsg.key })
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply(`Error al buscar`)
  }
};

handler.before = async (m, { conn }) => {
  const id = m.message?.buttonsResponseMessage?.selectedButtonId;
  if (!id) return;

  try {
    if (id.startsWith('audio_')) {
      const link = id.replace('audio_', '');
      let waitMsg = await conn.sendMessage(m.chat, { 
        text: `╭─ׅ─ׅ┈ ─๋︩︪─❖─๋︩︪─┈─ׅ─ׅ╮
╭╼⚡ 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗡𝗗𝗢 𝗔𝗨𝗗𝗜𝗢 ⚡╮
┃֪࣪
├ׁ̟̇❍✎ ${loadingBar(0)}
├ׁ̟̇❍✎ Esto puede tardar 10-20s
╰─ׅ─ׅ┈ ─๋︩︪─❖─๋︩︪─┈─ׅ─ׅ╯`
      }, { quoted: m });

      await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

      const res = await fetch(`${api.url}/download/audio?url=${encodeURIComponent(link)}&apikey=${api.key}`);
      const json = await res.json();

      if (!json.status || !json.result?.url) {
        await conn.sendMessage(m.chat, { delete: waitMsg.key })
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        return m.reply(`Audio no disponible`)
      }

      const data = json.result;
      await conn.sendMessage(m.chat, { delete: waitMsg.key })

      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

      await conn.sendMessage(m.chat, {
        audio: { url: data.url },
        mimetype: 'audio/mpeg',
        fileName: `${(data.title || 'audio').replace(/[^\w\s]/gi, '')}.mp3`,
        caption: `╭─ׅ─ׅ┈ ─๋︩︪─❖─๋︩︪─┈─ׅ─ׅ╮
╭╼☁️ 𝐀𝐔𝐃𝐈𝐎 ☁️╮
┃֪࣪
├ׁ̟̇❍✎ ${data.title || 'Audio'}
├ׁ̟̇❍✎ ⏱️ ${data.info?.duration || 'Desconocido'}
╰─ׅ─ׅ┈ ─๋︩︪─❖─๋︩︪─┈─ׅ─ׅ╯`
      }, { quoted: m });
    }

    if (id.startsWith('video_')) {
      const link = id.replace('video_', '')
      let waitMsg = await conn.sendMessage(m.chat, { 
        text: `╭─ׅ─ׅ┈ ─๋︩︪─❖─๋︩︪─┈─ׅ─ׅ╮
╭╼⚡ 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗡𝗗𝗢 𝗩𝗜𝗗𝗘𝗢 ⚡╮
┃֪࣪
├ׁ̟̇❍✎ ${loadingBar(0)}
├ׁ̟̇❍✎ Procesando con ffmpeg...
├ׁ̟̇❍✎ Tarda 30-60s según duración
╰─ׅ─ׅ┈ ─๋︩︪─❖─๋︩︪─┈─ׅ─ׅ╯`
      }, { quoted: m });

      await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

      const res = await fetch(`${api.url}/download/test?url=${encodeURIComponent(link)}&quality=240&apikey=${api.key}`)
      const json = await res.json()

      if (!json.status || !json.result?.url) {
        await conn.sendMessage(m.chat, { delete: waitMsg.key })
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        return m.reply('No se pudo obtener el video.')
      }

      const data = json.result
      const videoRes = await fetch(data.url)
      if (!videoRes.ok) throw new Error('VIDEO_DOWNLOAD_FAILED')

      const inputPath = path.join(os.tmpdir(), `yt_${Date.now()}.mp4`)
      const outputPath = path.join(os.tmpdir(), `wa_${Date.now()}.mp4`)

      fs.writeFileSync(inputPath, Buffer.from(await videoRes.arrayBuffer()))

      await execAsync(`ffmpeg -y -i "${inputPath}" -c:v libx264 -c:a aac -movflags +faststart "${outputPath}"`)

      const finalBuffer = fs.readFileSync(outputPath)
      await conn.sendMessage(m.chat, { delete: waitMsg.key })

      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

      await conn.sendMessage(m.chat, {
        video: finalBuffer,
        mimetype: 'video/mp4',
        fileName: `${(data.info?.title || 'video').replace(/[^\w\s]/gi, '')}.mp4`,
      }, { quoted: m });

      try {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath)
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath)
      } catch {}
    }

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply(`╭─ׅ─ׅ┈ ─๋︩︪─❖─๋︩︪─┈─ׅ─ׅ╮
╭╼☁️ 𝐄𝐑𝐎𝐑 ☁️╮
┃֪࣪
├ׁ̟̇❍✎ Fallo inesperado
├ׁ̟̇❍✎ Intenta nuevamente
╰─ׅ─ׅ┈ ─๋︩︪─❖─๋︩︪─┈─ׅ─ׅ╯`)
  }
}

handler.command = ['play', 'play2', 'mp3', 'mp4', 'ytmp3', 'ytmp4']
handler.tags = ['descargas']
handler.help = ['play']
handler.group = true

export default handler