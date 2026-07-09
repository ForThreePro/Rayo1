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
${lista.lunes.length? lista.lunes.map((u,i) => `│ ${i+1}. ${u.nombre} | ${u.numero} | ${u.premio}`).join('\n') : '│ Vacío'}
└────────────┘

┌─[ 𝗠𝗔𝗥𝗧𝗘𝗦 ]─┐
${lista.martes.length? lista.martes.map((u,i) => `│ ${i+1}. ${u.nombre} | ${u.numero} | ${u.premio}`).join('\n') : '│ Vacío'}
└──────────────┘

┌─[ 𝗠𝗜𝗘𝗥𝗖𝗢𝗟𝗘𝗦 ]─┐
${lista.miercoles.length? lista.miercoles.map((u,i) => `│ ${i+1}. ${u.nombre} | ${u.numero} | ${u.premio}`).join('\n') : '│ Vacío'}
└──────────────────┘

┌─[ 𝗝𝗨𝗘𝗩𝗘𝗦 ]─┐
${lista.jueves.length? lista.jueves.map((u,i) => `│ ${i+1}. ${u.nombre} | ${u.numero} | ${u.premio}`).join('\n') : '│ Vacío'}
└──────────────┘

┌─[ 𝗩𝗜𝗘𝗥𝗡𝗘𝗦 ]─┐
${lista.viernes.length? lista.viernes.map((u,i) => `│ ${i+1}. ${u.nombre} | ${u.numero} | ${u.premio}`).join('\n') : '│ Vacío'}
└───────────────┘

┌─[ 𝗦𝗔𝗕𝗔𝗗𝗢 ]─┐
${lista.sabado.length? lista.sabado.map((u,i) => `│ ${i+1}. ${u.nombre} | ${u.numero} | ${u.premio}`).join('\n') : '│ Vacío'}
└──────────────┘

┌─[ 𝗘𝗫𝗧𝗥𝗔 ]─┐
${lista.extra.length? lista.extra.map((u,i) => `│ ${i+1}. ${u.nombre} | ${u.numero} | ${u.premio}`).join('\n') : '│ Vacío'}
└────────────┘

>.list Nombre Numero Premio
>.extra Nombre Numero Premio
>.del Numero = Borrar - Solo Admin
`.trim()
        return conn.sendMessage(m.chat, { text: texto }, { quoted: m })
    }

    // ==========.list ==========
    if (comando === 'list') {
        if (hoy === 'domingo') return conn.reply(m.chat, '❌ Domingo no hay sorteos', m)
        let nombre = args[1]
        let numero = args[2]
        let premio = args.slice(3).join(' ')
        if (!nombre ||!numero ||!premio) return conn.reply(m.chat, `Ejemplo:\n.list Whois Bot 51936994155 50 soles`, m)

        let entrada = {nombre, numero, premio}

        // Borrar si ya estaba por número
        for (let d of Object.keys(data[gid])) {
            data[gid][d] = data[gid][d].filter(u => u.numero!== numero)
        }
        // Agregar a hoy
        data[gid][hoy].push(entrada)
        fs.writeFileSync(db, JSON.stringify(data, null, 2))
        return conn.reply(m.chat, `✅ ${nombre} | ${numero} | ${premio}\nAnotado para *${hoy.toUpperCase()}*`, m)
    }

    // ==========.extra ==========
    if (comando === 'extra') {
        let nombre = args[1]
        let numero = args[2]
        let premio = args.slice(3).join(' ')
        if (!nombre ||!numero ||!premio) return conn.reply(m.chat, `Ejemplo:\n.extra Juan 987654321 Bot`, m)

        let entrada = {nombre, numero, premio}

        for (let d of Object.keys(data[gid])) {
            data[gid][d] = data[gid][d].filter(u => u.numero!== numero)
        }
        data[gid].extra.push(entrada)
        fs.writeFileSync(db, JSON.stringify(data, null, 2))
        return conn.reply(m.chat, `✅ ${nombre} | ${numero} | ${premio}\nAnotado en *EXTRA*`, m)
    }

    // ==========.del ==========
    if (comando === 'del') {
        if (!isAdmin) return conn.reply(m.chat, '❌ Solo admins pueden borrar', m)
        let numero = args[1]
        if (!numero) return conn.reply(m.chat, 'Ejemplo:.del 51936994155', m)

        for (let d of Object.keys(data[gid])) {
            data[gid][d] = data[gid][d].filter(u => u.numero!== numero)
        }
        fs.writeFileSync(db, JSON.stringify(data, null, 2))
        return conn.reply(m.chat, `🗑️ ${numero} eliminado de la lista`, m)
    }

    conn.reply(m.chat, `Comandos:\n.v = Ver lista\n.list Nombre Numero Premio\n.extra Nombre Numero Premio\n.del Numero`, m)
}

handler.help = ['v', 'list Nombre Numero Premio', 'extra Nombre Numero Premio', 'del Numero']
handler.tags = ['sorteos']
handler.command = /^(v|list|extra|del)$/i
handler.group = true

export default handler