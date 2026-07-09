import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    // TUS DATOS
    const nombre = 'Carlos'
    const github = 'github.com/Kone457'
    const telegram = 't.me/Carlosx200'
    const whatsapp = '51936994155'
    const tienda = 'https://tu-tienda-web.com'

    // IMAGEN
    const banner = 'https://i.imgur.com/2M4lHcg.png'
    let thumb
    try {
        thumb = await (await fetch(banner)).buffer()
    } catch {}

    // MENSAJE
    let texto = `
╔═══『⚡ 𝗧𝗘𝗔𝗠 𝗡𝗜𝗚𝗛𝗧𝗪𝗜𝗦𝗛 ⚡』═══╗
     𝗗𝗘𝗦𝗔𝗥𝗥𝗢𝗟𝗔𝗗𝗢𝗥 𝗣𝗥𝗜𝗡𝗖𝗜𝗣𝗔𝗟
╚═══════════╝

👑 𝗡𝗼𝗺𝗯𝗿𝗲: ${nombre}
💻 𝗚𝗶𝘁𝗵𝘂𝗯: ${github}
📲 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺: ${telegram}
💬 𝗪𝗵𝗮𝘁𝘀𝗮𝗽: wa.me/${whatsapp}

┌─『 𝗦𝗘𝗥𝗩𝗜𝗖𝗜𝗢𝗦 』─┐
│ 🤖 Bots WhatsApp S/7
│ ⚡ Bots con IA S/30
│ 🌐 Web 1 Sección S/35
│ 🔥 COMBO FULL S/45
└───────────────────┘

📦 𝗧𝗶𝗲𝗻𝗱𝗮: ${tienda}

> Soporte 24/7 | Entrega Inmediata
`.trim()

    await conn.sendMessage(m.chat, {
        text: texto,
        contextInfo: {
            externalAdReply: {
                title: `👑 ${nombre} | TEAM NIGHTWISH`,
                body: "Desarrollador de Bots y Webs",
                thumbnail: thumb,
                mediaType: 1,
                sourceUrl: `https://wa.me/${whatsapp}`
            }
        }
    }, { quoted: m })
}

handler.help = ['creador', 'owner']
handler.tags = ['info']
handler.command = /^(creador|owner)$/i  // Acepta .creador .owner .Creador
handler.group = false
handler.private = true

export default handler