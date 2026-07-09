import { WAMessageStubType } from '@whiskeysockets/baileys';

export async function before(m, { conn, participants, groupMetadata }) {
    if (!m.messageStubType ||!m.isGroup) return true;

    const chat = globalThis.db.data.chats[m.chat];
    if (!chat.welcome) return true;

    const target = m.messageStubParameters?.[0];
    if (!target) return true;

    const userData = globalThis.db.data.users[target] || {};
    const targetName = userData.name || await conn.getName(target) || `@${target.split('@')[0]}`;

    const ppUrl = await conn.profilePictureUrl(target, 'image')
      .catch(() => 'https://i.imgur.com/2M4lHcg.png');

    const actor = m.participant || m.key.participant || m.messageStubParameters?.[1] || null;
    const isAdmin = participants.find(p => p.id === target)?.admin;

    let memberCount = participants.length;
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) memberCount++;
    if ([WAMessageStubType.GROUP_PARTICIPANT_REMOVE, WAMessageStubType.GROUP_PARTICIPANT_LEAVE].includes(m.messageStubType)) memberCount--;

    const actionText = {
        [WAMessageStubType.GROUP_PARTICIPANT_ADD]:
            actor? `🔗 Ingreso autorizado por @${actor.split('@')[0]}` : '⚡ Acceso directo al sistema',

        [WAMessageStubType.GROUP_PARTICIPANT_REMOVE]:
            actor? `🚫 Expulsado por @${actor.split('@')[0]}` : '🚫 Removido del sistema',

        [WAMessageStubType.GROUP_PARTICIPANT_LEAVE]:
            '👋 Sesión cerrada'
    };

    const format = (text) => {
        return text
          .replace('@user', `@${target.split('@')[0]}`)
          .replace('@name', targetName)
          .replace('@group', groupMetadata.subject)
          .replace('@desc', groupMetadata.desc?.toString() || 'Automatización y Ventas 24/7')
          .replace('%users', memberCount)
          .replace('@action', actionText[m.messageStubType] || '')
          .replace('@vip', isAdmin? '\n👑 [VIP ADMIN] 20% OFF EN COMBO FULL' : '');
    };

    const welcome = format(`
┌─『 ⚡ 𝗧𝗘𝗔𝗠 𝗡𝗜𝗚𝗛𝗧𝗪𝗜𝗦𝗛 』─┐
│ 𝗦𝗜𝗦𝗧𝗘𝗠𝗔 𝗗𝗘 𝗔𝗖𝗘𝗦𝗢
└──────────────────────────┘

👤 𝗨𝘀𝘂𝗮𝗿𝗶𝗼: @name
🏷️ 𝗚𝗿𝘂𝗽𝗼: @group
📌 𝗘𝘀𝘁𝗮𝗱𝗼: @action
@vip

┌─『 𝗦𝗘𝗥𝗩𝗜𝗖𝗜𝗢𝗦 𝗘𝗟𝗜𝗧𝗘 』─┐
│ 🤖 Bot Básico » S/7
│ ⚡ Bot con IA » S/30
│ 🌐 Web Landing » S/35
│ 🔥 COMBO FULL » S/45
└──────────────────────────┘

📜 @desc
👥 Miembro N° %users

💬 Comandos:
.catalogo |.pago |.soporte
`.trim());

    const bye = format(`
┌─『 💔 𝗖𝗢𝗡𝗘𝗫𝗜𝗢𝗡 𝗣𝗘𝗥𝗗𝗜𝗗𝗔 』─┐
│ 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 𝗗𝗘𝗦𝗖𝗢𝗡𝗘𝗖𝗧𝗔𝗗𝗢
└───────────────────────────────┘

👤 𝗨𝘀𝘂𝗮𝗿𝗶𝗼: @name
🏷️ 𝗚𝗿𝘂𝗽𝗼: @group
📌 𝗘𝘀𝘁𝗮𝗱𝗼: @action

😔 Gracias por haber estado aquí
👥 Miembros activos: %users

> TEAM NIGHTWISH | VUELVE PRONTO
`.trim());

    const mentions = [target];
    if (actor) mentions.push(actor);

    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
        await conn.sendMessage(m.chat, {
            image: { url: ppUrl },
            caption: welcome,
            footer: '⚡ Automatización Elite 24/7',
            contextInfo: { mentionedJid: mentions }
        });
    }

    if ([WAMessageStubType.GROUP_PARTICIPANT_LEAVE, WAMessageStubType.GROUP_PARTICIPANT_REMOVE].includes(m.messageStubType)) {
        await conn.sendMessage(m.chat, {
            image: { url: ppUrl },
            caption: bye,
            footer: 'TEAM NIGHTWISH',
            contextInfo: { mentionedJid: mentions }
        });
    }
}