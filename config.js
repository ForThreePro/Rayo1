import { watchFile, unwatchFile } from "fs"
import chalk from "chalk"
import { fileURLToPath } from "url"

global.botNumber = ""

global.owner = [
  ["51936994155", "Whois 👑", true],
  ["51904937048", "Bot 1", true],
  ["51930858072", "Bot 2", true]
]

global.botname = 'Rayo Prem Bot'
global.namebot = 'Rayo Prem Bot'
global.packname = 'Rayo Prem Bot'
global.wm = 'Rayo Prem Bot'
global.author = 'Whois'
global.dev = '© Team Nightwish.'

global.banner = 'https://files.evogb.win/1Iphoy.jpg'
global.banner2 = 'https://files.evogb.win/91Vvmc.jpg'
global.icon = 'https://files.evogb.win/91Vvmc.jpg'
global.currency = 'Coins'
global.sessions = 'sessions/session-bot'
global.jadi = 'sessions/session-sub'

global.api = {
  url: 'https://nexevo.boxmine.xyz',
  url2: 'https://api.vreden.my.id',
  url3: 'https://api-faa.my.id',
  url4: 'https://api.delirius.store',
  key: 'NEX-Shizuka'
}

global.my = {
  ch: '120363424754823499@newsletter',
  name: '꒰ ✨ Rayo Prem Bot ꒱'
}

const file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright(`Update "${file}"`))
  import(`${file}?update=${Date.now()}`)
})
