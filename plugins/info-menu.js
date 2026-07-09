import moment from 'moment-timezone'
import { getBotConfig } from '../lib/botconfig.js'

const CATEGORY_META = {
// ===== PRIORIDAD VENTAS =====
ventas: '💰 𝐕𝐄𝐍𝐓𝐀𝐒', // 1ro
sorteos: '🎁 𝐒𝐎𝐑𝐓𝐄𝐎𝐒', // 2do
owner: '👑 𝐎𝐖𝐍𝐄𝐑', // 3to

// ===== EL RESTO =====
main: '⚡ 𝐌𝐀𝐈𝐍',
rg: '👤 𝐑𝐄𝐆𝐈𝐒𝐓𝐑𝐎',
info: 'ℹ️ 𝐈𝐍𝐅𝐎',
ia: '🤖 𝐈𝐀 𝐆𝐏𝐓',
buscadores: '🔍 𝐁𝐔𝐒𝐐𝐔𝐄𝐃𝐀',
descargas: '📥 𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀𝐒',
imagen: '🖼️ 𝐈𝐌𝐀𝐆𝐄𝐍𝐄𝐒',
fun: '🎭 𝐃𝐈𝐕𝐄𝐑𝐒𝐈𝐎𝐍',
game: '🎮 𝐉𝐔𝐄𝐆𝐎𝐒',
anime: '⛩️ 𝐀𝐍𝐈𝐌𝐄',
grupo: '👑 𝐀𝐃𝐌𝐈𝐍',
gacha: '🎁 𝐆𝐀𝐂𝐇𝐀',
text: '✨ 𝐄𝐅𝐄𝐂𝐓𝐎𝐒',
rpg: '💰 𝐄𝐂𝐎𝐍𝐎𝐌𝐈𝐀',
sticker: '🏷️ 𝐒𝐓𝐈𝐂𝐊𝐄𝐑𝐒',
tools: '🛠️ 𝐇𝐄𝐑𝐀𝐌𝐈𝐄𝐍𝐓𝐀𝐒',
nsfw: '🔞 𝐍𝐒𝐅𝐖',
serbot: '📱 𝐒𝐔𝐁 𝐁𝐎𝐓𝐒',
}

let handler = async (m, { conn }) => {
try {
    await conn.sendMessage(m.chat, { react: { text: '⚡', key: m.key } })

    const pluginsActivos = Object.values(global.plugins || {}).filter(p =>!p?.disabled)
    const pluginsCount = pluginsActivos.length

    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY')
    const hora = moment.tz('America/Lima').format('hh:mm A')

    const byTag = {}
    for (const plugin of pluginsActivos) {
        const tags = Array.isArray(plugin.tags)? plugin.tags : (plugin.tags? [plugin.tags] : [])
        const helps = Array.isArray(plugin.help)? plugin.help : (plugin.help? [plugin.help] : [])
        for (const tag of tags) {
            if (!CATEGORY_META[tag]) continue
            if (!byTag[tag]) byTag[tag] = new Set()
            for (const h of helps) {
                if (typeof h === 'string' && h.trim()) {
                    byTag[tag].add(h.trim())
                }
            }
        }
    }

    const userName = m.pushName || 'Usuario'
    const botnameConfig = getBotConfig(conn, 'botname') || 'TEAM NIGHTWISH'

    const mainBotJid = global.conn?.user?.jid?.split(':')[0]
    const currentBotJid = conn.user?.jid?.split(':')[0]
    const isMainBot = mainBotJid && currentBotJid && mainBotJid === currentBotJid
    const botType = isMainBot? 'PREMIUM' : 'FREE'

    let menuTexto = `
╔═══『⚡ ${botnameConfig} ⚡』═══╗
    𝗦𝗜𝗦𝗧𝗘𝗠𝗔 𝗗𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦
╚═══『𝐕${pluginsCount} 𝐏𝐋𝐔𝐆𝐈𝐍𝐒』═══╝

👤 Usuario: ${userName}
🤖 Bot: ${botType}
📅 Fecha: ${fecha} | ${hora}

┌─『 𝐂𝐀𝐍𝐀𝐋 𝐎𝐅𝐈𝐂𝐈𝐀𝐋 』─┐
│ https://chat.whatsapp.com/GdBFa3UqUvzBFx4kXJtjGN?s=cl&p=a&ilr=0&amv=1
└────────────────────────────┘
`.trim() + '\n\n'

    for (const tag of Object.keys(CATEGORY_META)) {
        const set = byTag[tag]
        if (!set || set.size === 0) continue
        const cmds = [...set].sort()
        menuTexto += `┌─『 ${CATEGORY_META[tag]} 』─┐\n`
        menuTexto += cmds.map(c => `│ ❖.${c}`).join('\n') + '\n'
        menuTexto += `└───────────────────┘\n\n`
    }

    menuTexto += `
┌─『 𝐈𝐍𝐅𝐎 𝐔𝐓𝐈𝐋 』─┐
│.creador » Hablar con Admin
│.pago » Comprar Bot/Web
│.precios » Ver Catalogo
└──────────────────┘

> Desarrollado por Whois 💙 TEAM NIGHTWISH
`.trim()

    await conn.sendMessage(m.chat, {
        image: { url: getBotConfig(conn, 'banner2') || 'https://files.evogb.win/91Vvmc.jpg' },
        caption: menuTexto,
        footer: `TEAM NIGHTWISH | ${pluginsCount} Comandos Activos`
    }, { quoted: m })

} catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, {
        text: `✿ Error: ${e.message || e}`
    }, { quoted: m })
}
}

handler.help = ['menu', 'help']
handler.tags = ['info']
handler.command = ['menu', 'help', 'comandos']

export default handler