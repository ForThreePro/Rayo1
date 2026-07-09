import fs from 'fs'
import path from 'path'

const dbPath = path.join('./database', 'sorteos.json')
if (!fs.existsSync('./database')) fs.mkdirSync('./database')
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '{}')

const DIAS = ['lunes','martes','miercoles','jueves','viernes','sabado']
const TZ = 'America/Lima'

const REGLAS = `Comandos:
.v = Ver lista
.list Nombre / Numero / Premio
.extra Nombre / Numero / Premio
.del Numero
 ̶ ̶ ̶ ̶ ̶ ̶`

const cargarDB = () => {
    return JSON.parse(fs.readFileSync(dbPath))
}
const guardarDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}
const getHoy = () => {
    let dia = new Date().toLocaleString('es-PE', {timeZone: TZ, weekday: 'long'}).toLowerCase()
    dia = dia.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    return dia === 'domingo'? 'extra' : dia
}

let handler = async (m, { conn, args, command, isAdmin }) => {
    let gid = m.chat
    let data = cargarDB()
    if(!data[gid]) data[gid] = {lunes:[], martes:[], miercoles:[], jueves:[], viernes:[], sabado:[], extra:[]}

    let hoy = getHoy()
    let texto = args.join(' ')

    // =====.v =====
    if(command === 'v'){
        let msg = `╔═══『📋 LISTA SEMANAL』═══╗\n`
        for(let d of [...DIAS, 'extra']){
            msg += `\n┌─[ ${d.toUpperCase()} ]─┐\n`
            if(data[gid][d].length === 0) msg += `│ Vacío\n`
            else data[gid][d].forEach((u,i) => msg += `│ ${i+1}. ${u.nombre} | ${u.numero} | ${u.premio}\n`)
            msg += `└────────────┘\n`
        }
        msg += `\n${REGLAS}`
        return conn.reply(m.chat, msg, m)
    }

    // =====.list =====
    if(command === 'list'){
        if(hoy === 'extra') return conn.reply(m.chat, '❌ Domingo se anota solo en.extra', m)

        let [nombre, numero, premio] = texto.split('/').map(x => x.trim())
        numero = numero?.replace(/[^0-9]/g, '')

        if(!nombre ||!numero ||!premio) return conn.reply(m.chat, `Ejemplo:\n.list Whois / +51 936 994 155 / Bot mensual\n${REGLAS}`, m)

        // quitar duplicados
        for(let d of Object.keys(data[gid])){
            data[gid][d] = data[gid][d].filter(u => u.numero!== numero)
        }

        data[gid][hoy].push({nombre, numero, premio})
        guardarDB(data)
        return conn.reply(m.chat, `✅ ${nombre} | ${numero} | ${premio}\nAnotado en *${hoy.toUpperCase()}*\n\n${REGLAS}`, m)
    }

    // =====.extra =====
    if(command === 'extra'){
        let [nombre, numero, premio] = texto.split('/').map(x => x.trim())
        numero = numero?.replace(/[^0-9]/g, '')

        if(!nombre ||!numero ||!premio) return conn.reply(m.chat, `Ejemplo:\n.extra Juan / 999888777 / 20 soles\n\n${REGLAS}`, m)

        for(let d of Object.keys(data[gid])){
            data[gid][d] = data[gid][d].filter(u => u.numero!== numero)
        }

        data[gid].extra.push({nombre, numero, premio})
        guardarDB(data)
        return conn.reply(m.chat, `📦 ${nombre} | ${numero} | ${premio}\nAnotado en *EXTRA*\n\n${REGLAS}`, m)
    }

    // =====.del =====
    if(command === 'del'){
        if(!isAdmin) return conn.reply(m.chat, '❌ Solo admins', m)
        let numero = texto.replace(/[^0-9]/g, '')
        if(!numero) return conn.reply(m.chat, REGLAS, m)

        for(let d of Object.keys(data[gid])){
            data[gid][d] = data[gid][d].filter(u => u.numero!== numero)
        }
        guardarDB(data)
        return conn.reply(m.chat, `🗑️ ${numero} eliminado\n\n${REGLAS}`, m)
    }
}

handler.help = ['v','list','extra','del']
handler.tags = ['sorteos']
handler.command = ['v','list','extra','del']
handler.group = true
export default handler