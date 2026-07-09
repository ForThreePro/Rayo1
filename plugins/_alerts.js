let { WAMessageStubType } = (await import('@whiskeysockets/baileys')).default
import fs from 'fs'
import path from 'path'
import { getBotConfig } from '../lib/botconfig.js'

const lidCache = new Map()
let handler = m => m

handler.before = async function (m, { conn }) {
    if (!m.messageStubType ||!m.isGroup) return

    let chat = globalThis.db.data.chats[m.chat]
    let userss = m.messageStubParameters?.[0]
    if (!userss) return

    const realSenderRaw = await resolveLidToRealJid(m?.sender, conn, m?.chat)
    const realSender = realSenderRaw?.includes('@')? realSenderRaw : null

    const userTag = `@${userss.split('@')[0]}`
    const adminTag = realSender? `@${realSender.split('@')[0]}` : 'Sistema ⚡'

    const mentions = [userss]
    if (realSender) mentions.push(realSender)

    const context = {
        contextInfo: {
            mentionedJid: mentions,
            isForwarded: true
        }
    }

    const admingp = `
╔═══『👑 𝗡𝗨𝗘𝗩𝗢 𝗔𝗗𝗠𝗜𝗡 👑』═══╗
    𝗔𝗖𝗖𝗘𝗦𝗢 𝗡𝗜𝗩𝗘𝗟 𝗘𝗟𝗜𝗧𝗘
╚═══『⚡ 𝗧𝗘𝗔𝗠 𝗡𝗜𝗚𝗛𝗧𝗪𝗜𝗦𝗛 ⚡』═══╝

👤 Usuario: ${userTag}
🔓 Rango: ADMINISTRADOR

📌 Promovido por: ${adminTag}

━━━━━━━━━━━━━━━━━━
✨ Beneficios VIP:
├ 20% OFF en COMBO FULL
├ Acceso a comandos.panel
└ Prioridad en soporte

> Usa con responsabilidad el poder
`.trim()

    const noadmingp = `
╔═══『⚠️ 𝗔𝗗𝗠𝗜𝗡 𝗥𝗘𝗠𝗢𝗩𝗜𝗗𝗢 ⚠️』═══╗
    𝗣𝗘𝗥𝗠𝗜𝗦𝗢𝗦 𝗥𝗘𝗩𝗢𝗖𝗔𝗗𝗢𝗦
╚═══『⚡ 𝗧𝗘𝗔𝗠 𝗡𝗜𝗚𝗛𝗧𝗪𝗜𝗦𝗛 ⚡』═══╝

👤 Usuario: ${userTag}
🔒 Rango: MIEMBRO

📌 Degradado por: ${adminTag}

━━━━━━━━━━━━━━━━━━
❌ Ya no tiene acceso a:
├ Comandos de admin
├ Panel de control
└ Descuentos VIP
`.trim()

    // Anti-session cuando hay cambios
    if (chat.detect && m.messageStubType == 2) {
        const uniqid = (m.isGroup? m.chat : m.sender).split('@')[0]
        const sessionPath = `./sessions/`
        try {
            for (const file of await fs.readdir(sessionPath)) {
                if (file.includes(uniqid)) {
                    await fs.unlink(path.join(sessionPath, file))
                }
            }
        } catch {}
    }

    // Cuando dan admin
    if (chat.alerts && m.messageStubType == 29) {
        await conn.sendMessage(m.chat, {
            image: { url: getBotConfig(conn, 'banner') || 'https://i.imgur.com/2M4lHcg.png' },
            caption: admingp,
            footer: 'TEAM NIGHTWISH | ADMIN PANEL',
            buttons: [
                {buttonId: '.panel', buttonText: {displayText: '⚙️ PANEL ADMIN'}, type: 1}
            ],
            headerType: 4,
           ...context
        })
        return
    }

    // Cuando quitan admin
    if (chat.alerts && m.messageStubType == 30) {
        await conn.sendMessage(m.chat, {
            image: { url: getBotConfig(conn, 'banner') || 'https://i.imgur.com/2M4lHcg.png' },
            caption: noadmingp,
            footer: 'PERMISOS ACTUALIZADOS',
           ...context
        })
        return
    }

    if (m.messageStubType == 2) return
}

export default handler

async function resolveLidToRealJid(lid, conn, groupChatId, maxRetries = 3, retryDelay = 60000) {
    const inputJid = lid?.toString?.() || ''
    if (!inputJid.endsWith("@lid") ||!groupChatId?.endsWith("@g.us")) {
        return inputJid.includes("@")? inputJid : `${inputJid}@s.whatsapp.net`
    }
    if (lidCache.has(inputJid)) {
        return lidCache.get(inputJid)
    }
    const lidToFind = inputJid.split("@")[0]
    let attempts = 0
    while (attempts < maxRetries) {
        try {
            const metadata = await conn?.groupMetadata(groupChatId)
            if (!metadata?.participants) throw new Error()
            for (const participant of metadata.participants) {
                try {
                    if (!participant?.jid) continue
                    const contactDetails = await conn?.onWhatsApp(participant.jid)
                    if (!contactDetails?.[0]?.lid) continue
                    const possibleLid = contactDetails[0].lid.split("@")[0]
                    if (possibleLid === lidToFind) {
                        lidCache.set(inputJid, participant.jid)
                        return participant.jid
                    }
                } catch {}
            }
            lidCache.set(inputJid, inputJid)
            return inputJid
        } catch {
            if (++attempts >= maxRetries) {
                lidCache.set(inputJid, inputJid)
                return inputJid
            }
            await new Promise(r => setTimeout(r, retryDelay))
        }
    }
    return inputJid
}