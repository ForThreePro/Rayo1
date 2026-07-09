let handler = async (m, { conn, participants, isAdmin, groupMetadata }) => {
    // Solo admins pueden usarlo
    if (!isAdmin) return conn.reply(m.chat, '❌ Solo admins pueden usar este comando', m)

    let texto = m.text.split(' ').slice(1).join(' ')
    texto = texto ? `📢 𝗠𝗘𝗡𝗦𝗔𝗝𝗘:\n${texto}\n` : ''

    const groupName = groupMetadata.subject
    const groupLink = 'https://chat.whatsapp.com/GdBFa3UqUvzBFx4kXJtjGN?s=cl&p=a&ilr=0&amv=1'
    const groupPic = await conn.profilePictureUrl(m.chat, 'image').catch(() => 'https://files.evogb.win/91Vvmc.jpg')

    let menciones = participants.map(p => `@${p.id.split('@')[0]}`).join('\n│ ❖ ')

    let caption = `
╔═══『⚡ 𝗧𝗘𝗔𝗠 𝗡𝗜𝗚𝗛𝗧𝗪𝗜𝗦𝗛 ⚡』═══╗
     𝗔𝗩𝗜𝗦𝗢 𝗚𝗘𝗡𝗘𝗥𝗔𝗟 𝗔 𝗧𝗢𝗗𝗢𝗦
╚══════════╝

┌─[ 𝗚𝗥𝗨𝗣𝗢 ]─┐
│ 👥 Nombre: ${groupName}
│ 👤 Miembros: ${participants.length}
│ 🔗 Link: ${groupLink}
└─────────────┘

${texto}
┌─[ 𝗘𝗧𝗜𝗤𝗨𝗘𝗧𝗔𝗡𝗗𝗢 ]─┐
│ ❖ ${menciones}
└─────────────────────┘

> Admin: @${m.sender.split('@')[0]}
`.trim()

    await conn.sendMessage(m.chat, {
        image: { url: groupPic },
        caption: caption,
        mentions: participants.map(p => p.id).concat([m.sender])
    }, { quoted: m })

}

handler.help = ['todos <mensaje>']
handler.tags = ['group']
handler.command = ['todos', 'tagall', 'etiquetar']
handler.admin = true
handler.group = true

export default handler