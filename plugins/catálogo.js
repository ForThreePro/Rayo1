let handler = async (m, { conn }) => {
let catalogo = `
╔═══『🛒 𝗖𝗔𝗧𝗔𝗟𝗢𝗚𝗢 𝗧𝗘𝗔𝗠 𝗡𝗜𝗚𝗛𝗧𝗪𝗜𝗦𝗛 🛒』═══╗

🤖 *BOT WHATSAPP BÁSICO*
├ Precio: S/7
├ Respuestas automáticas 24/7
└ Anti-spam + Bienvenida

⚡ *BOT CON IA GPT* 
├ Precio: S/30
├ Responde como humano
└ Conecta con ChatGPT

🌐 *WEB 1 SECCIÓN*
├ Precio: S/35  
├ Landing page que vende
└ Diseño cyber responsive

🔥 *COMBO FULL* ⭐
├ Precio: S/45
├ Bot + Web + Soporte 30 días
└ OFERTA LIMITADA

╚═══════════════════════════════════╝

💳 Aceptamos: Yape, Global66, Prex
📲 Escribe .pago para comprar
`.trim()

await conn.sendMessage(m.chat, {
        image: { url: 'https://i.imgur.com/2M4lHcg.png' }, // Cambia por banner de tu tienda
        caption: catalogo,
        footer: 'TEAM NIGHTWISH | Entrega inmediata',
        buttons: [
            {buttonId: '.pago', buttonText: {displayText: '💳 COMPRAR AHORA'}, type: 1},
            {buttonId: '.web', buttonText: {displayText: '🌐 VER TIENDA WEB'}, type: 1}
        ],
        headerType: 4
    })
}
handler.command = ['catalogo', 'tienda', 'precios']
export default handler