let handler = async (m, { conn }) => {
    
    const qrYape = 'https://files.evogb.win/91Vvmc.jpg'
    const numeroYape = '936994155'
    const nombre = 'CARLOS'

    let texto = `
╔═══『💳 PAGO TEAM NIGHTWISH 💳』═══╗
      METODOS DE PAGO
╚═══════════╝

┌─[ YAPE / PLIN ]─┐
│
│ 📱 Numero: ${numeroYape}
│ 👤 Nombre: ${nombre}
│
│ 1. Escanea el QR o transfiere
│ 2. Manda captura del pago aqui
│ 3. Entrega inmediata ⚡
│
└──────────────────┘

┌─[ PRECIOS RAPIDOS ]─┐
│ 🤖 Bot Basico: S/7
│ ⚡ Bot Premium IA: S/30
│ 🌐 Web 1 Seccion: S/35
│ 💎 COMBO FULL: S/45
└─────────────────────┘

> Despues de pagar escribe: .creador
> Para ver catalogo: .precios
`.trim()

    await conn.sendMessage(m.chat, {
        image: { url: qrYape },
        caption: texto,
        footer: 'TEAM NIGHTWISH | Entrega en 5 minutos'
    }, { quoted: m })
}

handler.help = ['pago', 'comprar', 'yape']
handler.tags = ['ventas']
handler.command = /^(pago|comprar|yape|plin)$/i

export default handler