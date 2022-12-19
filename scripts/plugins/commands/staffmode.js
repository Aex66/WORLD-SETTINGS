/**
 * import { Script } from '../manager/Script.js'
import { getItemData, give, newItem, giveMany } from '../utils.js'
import Config from '../Data/Config.js'
import { Command } from '../classes/CommandHandler.js'
import { DataStore } from '../db/DataStore.js'
import { MinecraftEffectTypes } from 'mojang-minecraft'

const DB_INVS = new DataStore("INVS")

new Command({
  name: "staffmode",
  aliases: ["stm"],
  admin: true,
  description: "Turn on staff mode"
}, (data) => {
  const stafftools = {
    freeze: Script.createItem('minecraft:ice', {
      nameTag: Config.FREEZE_ITEM_NAMETAG,
      lore: ['§➥§l§eStaff§btools', '§' + ['I', 'D', ':', 'FREEZE'.split('').join('§')].join('§'), '§7Hint: Hit the player while holding', '§7to freeze them']
     }),
     vanish: Script.createItem('minecraft:clock', {
      nameTag: Config.VANISH_ITEM_NAMETAG,
      lore: ['§➥§l§eStaff§btools', '§' + ['I', 'D', ':', 'VANISH'.split('').join('§')].join('§'), '§7Hint: Right-click while holding', '§7to turn on/off vanish'],
    }),
    info: Script.createItem('minecraft:book', {
      nameTag: Config.INFO_ITEM_NAMETAG,
      lore: ['§➥§l§eStaff§btools', '§' + ['I', 'D', ':', 'INFO'.split('').join('§')].join('§'), '§7Hint: Hit the player while holding', '§7to see their info'],
    }),
    kill: Script.createItem('minecraft:barrier', {
      nameTag: Config.KILL_ITEM_NAMETAG,
      lore: ['§➥§l§eStaff§btools', '§' + ['I', 'D', ':', 'KILL'.split('').join('§')].join('§'), '§7Hint: Hit the player while holding', '§7to kill them']
    }),
    teleport: Script.createItem('minecraft:paper', {
      nameTag: Config.CLICK_TELEPORT_ITEM_NAMETAG,
      lore: ['§➥§l§eStaff§btools', '§' + ['I', 'D', ':', 'CLICK-TELEPORT'.split('').join('§')].join('§'), '§7Hint: Hit a block while holding', '§7to teleport to the block-location']
    }),
    randomTeleport: Script.createItem('minecraft:compass', {
      nameTag: Config.RANDOM_TELEPORT_ITEM_NAMETAG,
      lore: ['§➥§l§eStaff§btools', '§' + ['I', 'D', ':', 'RANDOM-TELEPORT'.split('').join('§')].join('§'), '§7Hint: Right-click while holding', '§7to teleport']
    }),
    playerTeleport: Script.createItem('minecraft:nether_star', {
      nameTag: Config.PLAYERS_ITEM_NAMETAG,
      lore: ['§➥§l§eStaff§btools', '§' + ['I', 'D', ':', 'PLAYER-LIST-TELEPORT'.split('').join('§')].join('§'), '§7Hint: Hit a block while holding', '§7to open the menu']
    })
  }

  const inventory = data.player.getComponent("inventory").container

  if (data.player.hasTag("staffmode")) {
    const now = Date.now()
    try {
      data.player.runCommand("effect @s clear")
      data.player.runCommand("clear")
    } catch {}
    const savedItems = DB_INVS.get(data.player.name)

    if (savedItems) {
      data.player.triggerEvent("unvanish")
      const items = savedItems
      items?.map((item) => give(data.player, newItem(item)))
      DB_INVS.delete(data.player.name)
    }
    data.player.tell('§eStaff§bmode §cOFF')
    data.player.removeTag("staffmode")
    console.warn("TIME", Date.now() - now + "ms")
    return;
  }

  const now = Date.now()
  const items = []
  for (let i = 0; i<inventory.size; i++) {
    let item = inventory.getItem(i)
    if (!item) continue;
    items.push(getItemData(item))
  }

  DB_INVS.set(data.player.name, items)
  try {
    data.player.runCommand('clear')
  } catch {}
  data.player.tell('§eYour inventory has been removed and everything will be returned except for what was in the §carmor §eand §coff-hand §eslots when you desactivate §astaff§bmode')
  giveMany(data.player, Object.values(stafftools))

  data.player.addEffect(MinecraftEffectTypes.invisibility, 9999999, 255, false)
  data.player.addEffect(MinecraftEffectTypes.nightVision, 9999999, 255, false)
  data.player.triggerEvent("vanish")

  data.player.tell('§eStaff§bmode §aON')
  data.player.playSound("random.levelup")
  data.player.addTag('staffmode')
  console.warn("TIME", Date.now() - now + "ms")
})
 */ 
