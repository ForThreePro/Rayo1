import fs from 'fs'
import moment from 'moment-timezone'

const db = './database/listas.json'
if (!fs.existsSync('./database')) fs.mkdirSync('./database')
if (!fs.existsSync(db)) fs.writeFileSync(db, '{}')

let handler = async (m, { conn, args, isAdmin }) => {
    let data = JSON.parse(fs.readFileSync(db))
    let gid = m.chat

    if (!data[gid]) data[gid] = {lunes:[], martes:[], miercoles:[], jueves:[], viernes:[], sabado:[], extra:[]}

    const dias = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado']
    let hoy = dias[moment.tz('America/Lima').day()]
    let comando = args[0]?.toLowerCase()

    // ==========.v ==========
    if (comando === 'v') {
        let lista = data[gid]
        let texto = `
╔═══『📋 𝗟𝗜𝗦𝗧𝗔 𝗦𝗘𝗠𝗔𝗡𝗔𝗟 ⚡』═══╗
       𝗧𝗘𝗔𝗠 𝗡𝗜𝗚𝗛𝗧𝗪𝗜𝗦𝗛
╚══════════╝

┌─[ 𝗟𝗨𝗡𝗘𝗦 ]─┐
${lista.lunes.length? lista.lunes.map((u,i) => `│ ${i+1}. @${u.split('@')[0]}`).join('\n') : '│ Vacío'}
└────────────┘

┌─[ 𝗠𝗔𝗥𝗧𝗘𝗦 ]─┐
${lista.martes.length? lista.martes.map((u,i) => `│ ${i+1}. @${u.split('@')[0]}`).join('\n') : '│ Vacío'}
└──────────────┘

┌─[ 𝗠𝗜𝗘𝗥𝗖𝗢𝗟𝗘𝗦 ]─┐
${lista.miercoles.length? lista.miercoles.map((u,i) => `│ ${i+1}. @${u.split('@')[0]}`).join('\n') : '│ Vacío'}
└──────────────────┘

┌─[ 𝗝𝗨𝗘𝗩𝗘𝗦 ]─┐
${lista.jueves.length? lista.jueves.map((u,i) => `│ ${i+1}. @${u.split('@')[0]}`).join('\n') : '│ Vacío'}
└──────────────┘

┌─[ 𝗩𝗜𝗘𝗥𝗡𝗘𝗦 ]─┐
${lista.viernes.length? lista.viernes.map((u,i) => `│ ${i+1}. @${u.split('@')[0]}`).join('\n') : '│ Vacío'}
└───────────────┘

┌─[ 𝗦𝗔𝗕𝗔𝗗𝗢 ]─┐
${lista.sabado.length? lista.sabado.map((u,i) => `│ ${i+1}. @${u.split('@')[0]}`).join('\n') : '│ Vacío'}
└──────────────┘

┌─[ 𝗘𝗫𝗧𝗥𝗔 ]─┐
${lista.extra.length? lista.extra.map((u,i) => `│ ${i+1}. @${u.split('@')[0]}`).join('\n') : '│ Vacío'}
└────────────┘

>.list = Anotarte hoy: ${hoy.toUpperCase()}
>.extra = Anotarte en EXTRA
>.del @usuario = Borrar - Solo Admin
`.trim()

        let allUsers = [...lista.lunes,...lista.martes,...lista.miercoles,...lista.jueves,...lista.viernes,...lista.sabado,...lista.extra]
        return conn.sendMessage(m.chat, { text: texto, mentions: allUsers }, { quoted: m })
    }

    // ==========.list ==========
    if (comando === 'list') {
        if (hoy === 'domingo') return conn.reply(m.chat, '❌ Domingo no hay sorteos', m)

        for (let d of Object.keys(data[gid])) {
            data[gid][d] = data[gid][d].filter(u => u!== m.sender)
        }
        data[gid][hoy].push(m.sender)
        fs.writeFileSync(db, JSON.stringify(data, null, 2))
        return conn.reply(m.chat, `✅ @${m.sender.split('@')[0]} anotado para *${hoy.toUpperCase()}*`, m)
    }

    // ==========.extra ==========
    if (comando === 'extra') {
        for (let d of Object.keys(data[gid])) {
            data[gid][d] = data[gid][d].filter(u => u!== m.sender)
        }
        data[gid].extra.push(m.sender)
        fs.writeFileSync(db, JSON.stringify(data, null, 2))
        return conn.reply(m.chat, `✅ @${m.sender.split('@')[0]} anotado en *EXTRA*`, m)
    }

    // ==========.del ==========
    if (comando === 'del') {
        if (!isAdmin) return conn.reply(m.chat, '❌ Solo admins pueden borrar', m)
        let user = m.mentionedJid[0]
        if (!user) return conn.reply(m.chat, 'Menciona a alguien:.del @usuario', m)

        for (let d of Object.keys(data[gid])) {
            data[gid][d] = data[gid][d].filter(u => u!== user)
        }
        fs.writeFileSync(db, JSON.stringify(data, null, 2))
        return conn.reply(m.chat, `🗑️ @${user.split('@')[0]} eliminado de la lista`, m)
    }

    conn.reply(m.chat, `Comandos:\n.v = Ver lista\n.list = Anotarte hoy\n.extra = Anotarte extra\n.del @ = Borrar`, m)
}

handler.help = ['v', 'list', 'extra', 'del @usuario']
handler.tags = ['sorteos']
handler.command = /^(v|list|extra|del)$/i
handler.group = true

export default handler