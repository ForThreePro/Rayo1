let handler = async (m, { conn }) => {
    
    let catalogo = `
╔═══『🔥 𝗖𝗔𝗧𝗔𝗟𝗢𝗚𝗢 𝗧𝗘𝗔𝗠 𝗡𝗜𝗚𝗛𝗧𝗪𝗜𝗦𝗛 🔥』═══╗
       𝗦𝗘𝗥𝗩𝗜𝗖𝗜𝗢𝗦 𝗗𝗜𝗚𝗜𝗧𝗔𝗟𝗘𝗦 𝟮𝟰/𝟳
╚══════════════════╝

┌─『 🤖 𝗕𝗢𝗧𝗦 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 』─┐
│ 
│ 🤖 𝗕𝗢𝗧 𝗕𝗔𝗦𝗜𝗖𝗢
│ ├ Precio: S/7.00
│ ├ Menú, Bienvenida, Anti-link
│ └ Soporte 7 días
│
│ ⚡ 𝗕𝗢𝗧 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗖𝗢𝗡 𝗜𝗔
│ ├ Precio: S/30.00  
│ ├ Todo lo del básico + GPT-4
│ ├ Descargas, IA, Juegos, RPG
│ └ Soporte 30 días + Actualizaciones
│
└─────────────────────────────┘

┌─『 🌐 𝗣𝗔𝗚𝗜𝗡𝗔𝗦 𝗪𝗘𝗕 』─┐
│
│ 🌐 𝗪𝗘𝗕 𝟭 𝗦𝗘𝗖𝗖𝗜𝗢𝗡
│ ├ Precio: S/35.00
│ ├ Landing page responsive
│ └ Entrega en 24h
│
│ 🏪 𝗪𝗘𝗕 𝗘𝗖𝗢𝗠𝗠𝗘𝗥𝗖𝗘
│ ├ Precio: S/80.00
│ ├ Tienda + Carrito + Pagos
│ └ Entrega en 3 días
│
└──────────────────────────┘

┌─『 🔥 𝗖𝗢𝗠𝗕𝗢 𝗘𝗟𝗜𝗧𝗘 』─┐
│
│ 💎 𝗖𝗢𝗠𝗕𝗢 𝗙𝗨𝗟𝗟
│ ├ Precio: S/45.00
│ ├ Bot Premium + Web 1 Sección
│ ├ 20% OFF + Dominio gratis 1 mes
│ └ Soporte Prioritario VIP
│
└─────────────────────────┘

┌─『 💳 𝗠𝗘𝗧𝗢𝗗𝗢𝗦 𝗗𝗘 𝗣𝗔𝗚𝗢 』─┐
│ Yape: 936994155
│ Plin: 936994155
│ Transferencia: BCP / Interbank
└───────────────────────────────┘

> 📲 Para comprar: .pago
> 👑 Soporte: .creador
`.trim()

    await conn.sendMessage(m.chat, {
        image: { url: 'https://i.imgur.com/2M4lHcg.png' }, // Cambia por banner de tu tienda
        caption: catalogo,
        footer: 'TEAM NIGHTWISH | Entrega Inmediata'
    }, { quoted: m })
}

handler.help = ['precios', 'catalogo', 'menuventa']
handler.tags = ['info']
handler.command = /^(precios|catalogo|menuventa)$/i
handler.group = false
handler.private = true

export default handler