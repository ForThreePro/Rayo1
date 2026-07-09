import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    const thumbUrl = `https://raw.githubusercontent.com/Kone457/Nexus/refs/heads/main/Anime/18a2f50ee4.jpg`
    
    let thumbBuffer
    try {
        thumbBuffer = await fetch(thumbUrl).then(res => res.buffer());
    } catch {
        thumbBuffer = null // Si falla la imagen no se cae el bot
    }

    let mensaje = `
╔═══『👑 𝗖𝗥𝗘𝗔𝗗𝗢𝗥 𝗧𝗘𝗔𝗠 𝗡𝗜𝗚𝗛𝗧𝗪𝗜𝗦𝗛 👑』═══╗

👤 𝗡𝗼𝗺𝗯𝗿𝗲: Carlos
💻 𝗚𝗶𝘁𝗵𝘂𝗯: github.com/Kone457
📲 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺: t.me/Carlosx200
💬 𝗪𝗵𝗮𝘁𝘀𝗮𝗽𝗽: wa.me/51936994155

━━━━━━━━━━━━━━━━━━
🤖 Desarrollador de Bots y Webs
⚡ Ventas 24/7 | Soporte Elite

╚══════════════════╝
`.trim();

    await conn.sendMessage(m.chat, {
        text: mensaje,
        contextInfo: {
            forwardingScore: 1,
            isForwarded: false,
            externalAdReply: {
                title: "TEAM NIGHTWISH",
                body: "Desarrollador: Carlos | Ventas 24/7",
                thumbnail: thumbBuffer,
                mediaType: 1,
                sourceUrl: "https://wa.me/51936994155" // Cambia por tu link real
            }
        }
    }, { quoted: m })
}

handler.help = ['creador', 'owner']
handler.tags = ['info']
handler.command = ['creador', 'owner']
handler.owner = false

export default handler