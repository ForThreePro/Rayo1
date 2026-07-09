let handler = async (m, { conn }) => {
    let texto = `
👑 CONTACTO OWNER
Numero: 936994155
Nombre: CARLOS

Escribeme para comprar o soporte
`.trim()

    await conn.reply(m.chat, texto, m)
}

handler.help = ['owner']
handler.tags = ['owner'] // Sale en categoria OWNER del menu
handler.command = /^(owner|creador)$/i

export default handler