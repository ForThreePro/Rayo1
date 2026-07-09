import fs from 'fs'
let handler = async (m, { conn }) => {
    let db = './database/listas.json'
    if (!fs.existsSync(db)) fs.writeFileSync(db, '{}')
    let data = JSON.parse(fs.readFileSync(db))

    let gid = m.chat
    if (!data[gid]) data[gid] = {lunes:[], martes:[], miercoles:[], jueves:[], viernes:[], sabado:[], extra:[]}

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

> Usa.lista para anotarte hoy
> Usa.extra para anotarte en extra
> Usa.del @usuario para borrar - Solo Admin
`.trim()

    await conn.sendMessage(m.chat, {
        text: texto,
        mentions: [...lista.lunes,...lista.martes,...lista.miercoles,...lista.jueves,...lista.viernes,...lista.sabado,...lista.extra]
    }, { quoted: m })
}
handler.help = ['ver lista']
handler.tags = ['sorteos']
handler.command = /^(ver\s*lista)$/i // <- Ahora solo funciona con "ver lista"
export default handler