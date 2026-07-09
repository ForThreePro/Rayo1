let handler = async (m, { conn }) => {
    
    let texto = `
╔═══『🔥 CATALOGO TEAM NIGHTWISH 🔥』═══╗
     SERVICIOS DIGITALES 24/7
╚══════════╝

┌─[ BOTS WHATSAPP ]─┐
│ 
│ 🤖 BOT BASICO
│ Precio: S/7
│ Incluye: Menu, Bienvenida, Anti-link
│
│ ⚡ BOT PREMIUM CON IA
│ Precio: S/30
│ Incluye: GPT-4, Descargas, Juegos
│
└───────────────────┘

┌─[ PAGINAS WEB ]─┐
│
│ 🌐 WEB 1 SECCION
│ Precio: S/35
│ Entrega: 24 horas
│
│ 🏪 WEB ECOMMERCE  
│ Precio: S/80
│ Tienda + Carrito + Pagos
│
└─────────────────┘

┌─[ COMBO ELITE ]─┐
│
│ 💎 COMBO FULL
│ Precio: S/45
│ Bot Premium + Web
│ 20% OFF + Soporte VIP
│
└─────────────────┘

┌─[ METODOS DE PAGO ]─┐
│ Yape: 936994155
│ Plin: 936994155
└─────────────────────┘

> Para comprar usa: .pago
> Soporte: .creador
`.trim()

    await conn.reply(m.chat, texto, m)
}

handler.help = ['precios', 'catalogo']
handler.tags = ['ventas']
handler.command = /^(precios|catalogo|lista)$/i

export default handler