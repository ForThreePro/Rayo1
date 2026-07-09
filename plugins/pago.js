import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    
    // PON AQUÍ TU QR DE YAPE
    const qrYape = 'https://i.imgur.com/TU_QR_YAPE.png' // Sube tu QR a imgur y pégalo aquí
    const numeroYape = '936994155'
    const nombre = 'CARLOS' // Nombre que sale en Yape

    let texto = `
╔═══『💳 𝗣𝗔𝗚𝗢 𝗧𝗘𝗔𝗠 𝗡𝗜𝗚𝗛𝗧𝗪𝗜𝗦𝗛 💳』═══╗
       𝗠𝗘𝗧𝗢𝗗𝗢𝗦 𝗗𝗘 𝗣𝗔𝗚𝗢
╚═══════════╝

┌─『 𝗬𝗔𝗣𝗘 / 𝗣𝗟𝗜𝗡 』─┐
│
│ 📱 𝗡𝘂𝗺𝗲𝗿𝗼: ${numeroYape}
│ 👤 𝗡𝗼𝗺𝗯𝗿𝗲: ${nombre}
│
│ 1. Escanea el QR o transfiere
│ 2. Manda captura del pago
│ 3. Entrega inmediata ⚡
│
└─────────────────────┘

┌─『 𝗣𝗥𝗘𝗖𝗜𝗢𝗦 𝗥𝗔𝗣𝗜𝗗𝗢𝗦 』─┐
│ 🤖 Bot Basico: S/7
│ ⚡ Bot Premium IA: S/30
│ 🌐 Web 1 Seccion: S/35
│ 💎 COMBO FULL: S/45
└──────────────────────────┘

> Despues de pagar escribe: .creador
> Para ver catalogo: .precios
`.trim()

    let qrBuffer
    try {
        qrBuffer = await (await fetch(qrYape)).buffer()
    } catch {
        qrBuffer = null
    }

    await conn.sendMessage(m.chat, {
        image: qrBuffer? { url: qrYape } : { url: 'https://i.imgur.com/2M4lHcg.png' },
        caption: texto,
        footer: 'TEAM NIGHTWISH | Entrega en 5 minutos'
    }, { quoted: m })
}

handler.help = ['pago', 'comprar', 'yape']
handler.tags = ['ventas']
handler.command = /^(pago|comprar|yape|plin)$/i

export default handler