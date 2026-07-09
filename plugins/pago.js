let handler = async (m, { conn }) => {
    
    let texto = `
╔═══[ PAGO TEAM NIGHTWISH ]═══╗
     METODOS DE PAGO
╚═══════════╝

[ YAPE / PLIN ]
Numero: 936994155
Nombre: CARLOS

PASOS:
1. Yapea o Plinea al numero
2. Manda captura del pago aqui
3. Entrega inmediata ⚡

[ PRECIOS ]
Bot Basico: S/7
Bot Premium IA: S/30
Web 1 Seccion: S/35
COMBO FULL: S/45

> Despues de pagar escribe: .creador
> Para ver catalogo: .precios
`.trim()

    await conn.reply(m.chat, texto, m)
}

handler.help = ['pago', 'comprar', 'yape']
handler.tags = ['ventas']
handler.command = /^(pago|comprar|yape|plin)$/i

export default handler