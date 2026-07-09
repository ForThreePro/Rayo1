import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    // 1. DATOS DEL CREADOR - EDITAR AQUÍ
    const creador = {
        nombre: 'Carlos',
        github: 'github.com/Kone457',
        telegram: 't.me/Carlosx200',
        whatsapp: '51936994155', // Sin + y sin espacios
        tienda: 'https://tu-tienda-web.com' // Pon tu link de productos.html
    }

    // 2. IMAGEN DEL BANNER
    const banner = 'https://i.imgur.com/2M4lHcg.png' // Cambia por tu logo
    let thumb
    try {
        thumb = await (await fetch(banner)).buffer()
    } catch {
        thumb = null
    }

    // 3. MENSAJE ESTILO CYBER
    let texto = `
╔═══『⚡ 𝗧𝗘𝗔𝗠 𝗡𝗜𝗚𝗛𝗧𝗪𝗜𝗦𝗛 ⚡』═══╗
      𝗗𝗘𝗦𝗔𝗥𝗥𝗢𝗟𝗟𝗔𝗗𝗢𝗥 𝗣𝗥𝗜𝗡𝗖𝗜𝗣𝗔𝗟
╚═══════════╝

👑 𝗡𝗼𝗺𝗯𝗿𝗲: ${creador.nombre}
💻 𝗚𝗶𝘁𝗵𝘂𝗯: ${creador.github}
📲 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺: ${creador.telegram}
💬 𝗪𝗵𝗮𝘁𝘀𝗮𝗽: wa.me/${creador.whatsapp}

┌─『 𝗦𝗘𝗥𝗩𝗜𝗖𝗜𝗢𝗦 』─┐
│ 🤖 Bots WhatsApp
│ ⚡ Bots con IA GPT  
│ 🌐 Páginas Web
│ 🔥 Automatización
└───────────────────┘

📦 𝗧𝗶𝗲𝗻𝗱𝗮: ${creador.tienda}

> Soporte 24/7 | Entrega Inmediata
`.trim()

    // 4. ENVIAR CON TARJETA PREVIEW
    await conn.sendMessage(m.chat, {
        text: texto,
        contextInfo: {
            mentionedJid: [m.sender],
            externalAdReply: {
                title: `👑 ${creador.nombre} | TEAM NIGHTWISH`,
                body: "Desarrollador de Bots y Webs | Ventas 24/7",
                thumbnail: thumb,
                mediaType: 1,
                renderLargerThumbnail: true,
                sourceUrl: `https://wa.me/${creador.whatsapp}`
            }
        }
    }, { quoted: m })
}

handler.help = ['creador', 'owner', 'creadorbot']
handler.tags = ['info']
handler.command = /^(creador|owner|creadorbot)$/i

export default handler