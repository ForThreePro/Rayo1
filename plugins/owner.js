let handler = async (m, { conn }) => {
    
    const banner = 'https://files.evogb.win/91Vvmc.jpg' // Mismo banner de ventas
    const numero = '936994155'
    
    let texto = `
╔═══『👑 𝗖𝗢𝗡𝗧𝗔𝗖𝗧𝗢 𝗢𝗪𝗡𝗘𝗥 👑』═══╗
       𝗧𝗘𝗔𝗠 𝗡𝗜𝗚𝗛𝗧𝗪𝗜𝗦𝗛
╚══════════╝

┌─[ 𝗔𝗗𝗠𝗜𝗡𝗜𝗦𝗧𝗥𝗔𝗗𝗢𝗥 ]─┐
│
│ 📱 𝗪𝗵𝗮𝘁𝘀𝗮𝗽𝗽: ${numero}
│ 👤 𝗡𝗼𝗺𝗯𝗿𝗲: Whois
│ ⚡ 𝗔𝘁𝗲𝗻𝗰𝗶𝗼𝗻: 24/7
│
└─────────────────────┘

┌─[ 𝗦𝗢𝗣𝗢𝗥𝗧𝗘 𝗬 𝗩𝗘𝗡𝗧𝗔𝗦 ]─┐
│ 
│ 1. Cotizaciones Personalizadas
│ 2. Soporte VIP Post-Venta  
│ 3. Pedidos Urgentes
│
└───────────────────────────┘

> Clic aqui para escribirme:
> wa.me/51${numero}

> Usa .pago para comprar
> Usa .precios para ver catalogo
`.trim()

    await conn.sendMessage(m.chat, {
        image: { url: banner },
        caption: texto,
        footer: 'OWNER | Respuesta en menos de 5 min'
    }, { quoted: m })
}

handler.help = ['owner', 'creador']
handler.tags = ['owner']
handler.command = /^(owner|creador|admin)$/i

export default handler