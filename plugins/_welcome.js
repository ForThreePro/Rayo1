import { WAMessageStubType } from '@whiskeysockets/baileys';

export async function before(m, { conn, participants, groupMetadata }) {
    if (!m.messageStubType ||!m.isGroup) return true;

    const chat = globalThis.db.data.chats[m.chat];
    if (!chat.welcome) return true; // Si está apagado no hace nada

    const target = m.messageStubParameters?.[0];
    if (!target) return true;

    const userData = globalThis.db.data.users[target] || {};
    const targetName = userData.name || await conn.getName(target) || `@${target.split('@')[0]}`;

    const ppUrl = await conn.profilePictureUrl(target, 'image')
       .catch(() => 'https://i.imgur.com/2M4lHcg.png'); // Logo por defecto cyber

    const actor = m.participant || m.key.participant || m.messageStubParameters?.[1] || null;
    const isAdmin = participants.find(p => p.id === target)?.admin;

    let memberCount = participants.length;
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) memberCount++;
    if ([WAMessageStubType.GROUP_PARTICIPANT_REMOVE, WAMessageStubType.GROUP_PARTICIPANT_LEAVE].includes(m.messageStubType)) memberCount--;

    const actionText = {
        [WAMessageStubType.GROUP_PARTICIPANT_ADD]:
            actor? `🔗 Agregado por @${actor.split('@')[0]}` : '⚡ Entró al sistema',

        [WAMessageStubType.GROUP_PARTICIPANT_REMOVE]:
            actor? `🚫 Eliminado por @${actor.split('@')[0]}` : '🚫 Eliminado del sistema',

        [WAMessageStubType.GROUP_PARTICIPANT_LEAVE]:
            '👋 Desconectado del sistema'
    };

    const format = (text) => {
        return text
           .replace('@user', `@${target.split('@')[0]}`)
           .replace('@name', targetName)
           .replace('@group', groupMetadata.subject)
           .replace('@desc', groupMetadata.desc?.toString() || 'Automatización Elite 24/7')
           .replace('%users', memberCount)
           .replace('@action', actionText[m.messageStubType] || '')
           .replace('@vip', isAdmin? '👑 VIP ADMIN - 20% OFF COMBO' : '');
    };

    const welcome = format(`
╔═══『⚡ 𝗧𝗘𝗔𝗠 𝗡𝗜𝗚𝗛𝗧𝗪𝗜𝗦𝗛 ⚡』═══╗
    𝗔𝗖𝗖𝗘𝗦𝗢 𝗖𝗢𝗡𝗖𝗘𝗗𝗜𝗗𝗢
╚═══『⚡ 𝗔𝗨𝗧𝗢𝗠𝗔𝗧𝗜𝗭𝗔𝗖𝗜𝗢𝗡 𝗘𝗟𝗜𝗧𝗘 ⚡』═══╝

👤 Usuario: @name
🏷️ Sistema: @group
📌 @action
@vip

━━━━━━━━━━━━━━━━━━
🤖 𝗦𝗘𝗥𝗩𝗜𝗖𝗜𝗢𝗦 𝗗𝗜𝗦𝗣𝗢𝗡𝗜𝗕𝗟𝗘𝗦:
├ 🤖 Bot WhatsApp Básico: S/7
├ ⚡ Bot con IA GPT: S/30
├ 🌐 Web 1 Sección: S/35
└ 🔥 COMBO FULL: S/45
━━━━━━━━━━━━━━━━━━

📜 @desc
👥 Miembro # %users

> Escribe.catalogo para ver demo
> Escribe.pago para comprar ya
`.trim());

    const bye = format(`
╔═══『💔 𝗖𝗢𝗡𝗘𝗫𝗜𝗢𝗡 𝗣𝗘𝗥𝗗𝗜𝗗𝗔 💔』═══╗
    𝗨𝗦𝗨𝗔𝗥𝗜𝗢 𝗗𝗘𝗦𝗖𝗢𝗡𝗘𝗖𝗧𝗔𝗗𝗢
╚═══『⚡ 𝗧𝗘𝗔𝗠 𝗡𝗜𝗚𝗛𝗧𝗪𝗜𝗦𝗛 ⚡』═══╝

👤 Usuario: @name
🏷️ Sistema: @group
📌 @action

😢 Esperamos verte de nuevo pronto...
👥 Miembros activos: %users

> ¿Necesitas soporte? Escribe.admin
`.trim());

    const mentions = [target];
    if (actor) mentions.push(actor);

    const buttons = [
        {buttonId: '.catalogo', buttonText: {displayText: '🛒 VER CATALOGO'}, type: 1},
        {buttonId: '.pago', buttonText: {displayText: '💳 COMPRAR AHORA'}, type: 1},
        {buttonId: '.soporte', buttonText: {displayText: '📲 HABLAR CON ADMIN'}, type: 1}
    ];

    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
        await conn.sendMessage(m.chat, {
            image: { url: ppUrl },
            caption: welcome,
            footer: 'TEAM NIGHTWISH | VENTAS 24/7',
            buttons: buttons,
            headerType: 4,
            contextInfo: { mentionedJid: mentions }
        });
    }

    if ([WAMessageStubType.GROUP_PARTICIPANT_LEAVE, WAMessageStubType.GROUP_PARTICIPANT_REMOVE].includes(m.messageStubType)) {
        await conn.sendMessage(m.chat, {
            image: { url: ppUrl },
            caption: bye,
            footer: 'VUELVE PRONTO',
            contextInfo: { mentionedJid: mentions }
        });
    }
}