let handler = async (m, { conn, participants, isAdmin }) => {
    // Solo admins pueden usarlo
    if (!isAdmin) return conn.reply(m.chat, '❌ Solo admins pueden usar este comando', m)

    let texto = m.text.split(' ').slice(1).join(' ')
    texto = texto? `📢 𝗠𝗘𝗡𝗦𝗔𝗝𝗘: ${texto}\n\n` : ''

    let mensaje = `
╔═══『⚡ 𝗧𝗘𝗔𝗠 𝗡𝗜𝗚𝗛𝗧𝗪𝗜𝗦𝗛 ⚡』═══╗
    𝗔𝗧𝗘𝗡𝗖𝗜𝗢𝗡 𝗚𝗘𝗡𝗘𝗥𝗔𝗟
╚══════════════════╝

${texto}👥 𝗘𝗧𝗜𝗤𝗨𝗘𝗧𝗔𝗡𝗗𝗢 𝗔 𝗧𝗢𝗗𝗢𝗦:
`.trim()

    for (let i = 0; i < participants.length; i++) {
        mensaje += `\n│ ❖ @${participants[i].id.split('@')[0]}`
    }
    
    mensaje += `\n└───────────────────┘\n\n> ${participants.length} Miembros etiquetados`

    await conn.sendMessage(m.chat, {
        text: mensaje,
        mentions: participants.map(p => p.id)
    }, { quoted: m })

}

handler.help = ['todos <mensaje>']
handler.tags = ['group']
handler.command = ['todos', 'tagall', 'etiquetar']
handler.admin = true
handler.group = true

export default handler