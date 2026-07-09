import fs from 'fs'
import moment from 'moment-timezone'

const db = './database/listas.json'
if (!fs.existsSync('./database')) fs.mkdirSync('./database')
if (!fs.existsSync(db)) fs.writeFileSync(db, '{}')

const REGLAS = `Comandos:
.v = Ver lista
.list Nombre / Numero / Premio
.extra Nombre / Numero / Premio
.del Numero
 ̶ ̶ ̶ ̶ ̶ ̶`

let handler = async (m, { conn, args, isAdmin }) => {
    let data = JSON.parse(fs.readFileSync(db))
    let gid = m.chat

    if (!data[gid]) data[gid] = {lunes:[], martes:[], miercoles:[], jueves:[], viernes:[], sabado:[], extra:[]}

    const dias = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado']
    let hoy = dias[moment.tz('America/Lima').day()]
    let comando = args[0]?.toLowerCase()
    let textoCompleto = args.slice(1).join(' ') // agarra todo después del comando

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

${REGLAS}`.trim()
        return conn.sendMessage(m.chat, { text: texto }, { quoted: m })
    }

    // ==========.list ==========
    if (comando === 'list') {
        if (hoy === 'domingo') return conn.reply(m.chat, '❌ Domingo no hay sorteos', m)

        let partes = textoCompleto.split('/').map(s => s.trim())
        let nombre = partes[0]
        let numero = partes[1]?.replace(/[^0-9]/g, '') // quita +, espacios
        let premio = partes[2]

        if (!nombre ||!numero ||!premio) return conn.reply(m.chat, `Ejemplo:\n.list Whois / +51 936 994 155 / Bot mensual\n${REGLAS}`, m)

        let entrada = {nombre, numero, premio}
        for (let d of Object.keys(data[gid])) {
            data[gid][d] = data[gid][d].filter(u => u.numero!== numero)
        }
        data[gid][hoy].push(entrada)
        fs.writeFileSync(db, JSON.stringify(data, null, 2))

        return conn.reply(m.chat, `✅ ${nombre} | ${numero} | ${premio}\nAnotado para *${hoy.toUpperCase()}*\n\n${REGLAS}`, m)
    }

    // ==========.extra ==========
    if (comando === 'extra') {
        let partes = textoCompleto.split('/').map(s => s.trim())
        let nombre = partes[0]
        let numero = partes[1]?.replace(/[^0-9]/g, '')
        let premio = partes[2]

        if (!nombre ||!numero ||!premio) return conn.reply(m.chat, `Ejemplo:\n.extra Juan / +51 999 888 777 / Bot VIP\n\n${REGLAS}`, m)

        let entrada = {nombre, numero, premio}
        for (let d of Object.keys(data[gid])) {
            data[gid][d] = data[gid][d].filter(u => u.numero!== numero)
        }
        data[gid].extra.push(entrada)
        fs.writeFileSync(db, JSON.stringify(data, null, 2))

        return conn.reply(m.chat, `✅ ${nombre} | ${numero} | ${premio}\nAnotado en *EXTRA*\n\n${REGLAS}`, m)
    }

    // ==========.del ==========
    if (comando === 'del') {
        if (!isAdmin) return conn.reply(m.chat, '❌ Solo admins pueden borrar', m)
        let numero = args[1]?.replace(/[^0-9]/g, '')
        if (!numero) return conn.reply(m.chat, REGLAS, m)

        for (let d of Object.keys(data[gid])) {
            data[gid][d] = data[gid][d].filter(u => u.numero!== numero)
        }
        fs.writeFileSync(db, JSON.stringify(data, null, 2))

        return conn.reply(m.chat, `🗑️ ${numero} eliminado de la lista\n${REGLAS}`, m)
    }

    return conn.reply(m.chat, REGLAS, m)
}

handler.help = ['v', 'list Nombre / Numero / Premio', 'extra Nombre / Numero / Premio', 'del Numero']
handler.tags = ['sorteos']
handler.command = /^(v|list|extra|del)$/i
handler.group = true

export default handler