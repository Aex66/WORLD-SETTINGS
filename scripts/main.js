/*
Developers:
Aex66:
Discord: Aex66#0202
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
           _____
          /  _  \   ____ ___  ___
         /  /_\  \_/ __ \\  \/  /
        /    |    \  ___/ >    <
        \____|__  /\___  >__/\_ \
                \/     \/      \/
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
© Copyright 2022 all rights reserved. Do NOT steal, copy the code, or claim it as yours
Thank you
*/
import { world, Player, system, MinecraftEffectTypes, MinecraftEntityTypes, MinecraftBlockTypes } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { adminTag, itemId, itemName } from './config.js';
system.events.beforeWatchdogTerminate.subscribe(res => res.cancel = true);
import Database from './lib/Database.js';
import './plugins/commands/import.js';
import Script from "./lib/Script.js";
import { sleep } from "./extras/Utils.js";
const settings = Database('world-settings');
let init = false;
world.events.worldInitialize.subscribe(async () => {
    if (settings.allKeys().length >= 11)
        return;
    settings.write('welcomeMessage', false);
    settings.write('pvp', true);
    settings.write('tnt', true);
    settings.write('endCrystal', true);
    settings.write('chat', true);
    settings.write('hunger', true);
    settings.write('breakBlocks', true);
    settings.write('placeBlocks', true);
    settings.write('useSwitchesAndDoors', true);
    settings.write('openContainers', true);
    settings.write('defaultGamemode', 'survival');
    world.say({ rawtext: [{ translate: 'api.ws.init.count.three' }] });
    await sleep(20);
    world.say({ rawtext: [{ translate: 'api.ws.init.count.two' }] });
    await sleep(20);
    world.say({ rawtext: [{ translate: 'api.ws.init.count.one' }] });
    await sleep(20);
    world.say({ rawtext: [{ translate: 'api.ws.init.succes' }] });
    world.playSound('random.levelup');
    Script.emit('wsInit');
});
const settingsUI = (player) => {
    if (!player.hasTag(adminTag))
        return;
    const gamemodes = ['survival', 'creative', 'adventure', 'spectator'];
    const indexGm = gamemodes.findIndex((gm) => gm === all?.defaultGamemode);
    const form = new ModalFormData();
    form.title('WORLD SETTINGS');
    form.textField('Welcome message (Doesn\'t work for now)', 'message', '§eWelcome to my server!')
        .dropdown('DEFAULT GAMEMODE', gamemodes, indexGm)
        .toggle("PvP", all?.pvp)
        .toggle("TNT", all?.tnt)
        .toggle("END CRYSTALS", all?.endCrystal)
        .toggle("Chat", all?.chat)
        .toggle("Hunger", all?.hunger)
        .toggle("Break Blocks", all?.breakBlocks)
        .toggle("Place Blocks", all?.placeBlocks)
        .toggle("Use Switches and Doors", all?.useSwitchesAndDoors)
        .toggle("Open Containers", all?.openContainers)
        .show(player).then(async (res) => {
        const [msg, gamemode, pvp, tnt, endCrystal, chat, hunger, breakBlocks, placeBlocks, useSwitchesAndDoors, openContainers] = res.formValues;
        player.tell({ rawtext: [{ translate: 'api.ws.settings.change.succes' }] });
        settings.write('welcomeMessage', msg);
        settings.write('pvp', pvp);
        settings.write('tnt', tnt);
        settings.write('endCrystal', endCrystal);
        settings.write('chat', chat);
        settings.write('hunger', hunger);
        settings.write('breakBlocks', breakBlocks);
        settings.write('placeBlocks', placeBlocks);
        settings.write('useSwitchesAndDoors', useSwitchesAndDoors);
        settings.write('openContainers', openContainers);
        settings.write('defaultGamemode', gamemodes[gamemode]);
        await sleep(20);
        Script.emit('SettingChange', { player });
    });
};
world.events.beforeItemUse.subscribe((res) => {
    if (!(res.source instanceof Player))
        return;
    if (res.item.typeId === itemId && res.item?.nameTag === itemName) {
        settingsUI(res.source);
    }
});
let all = Database('world-settings').getCollection();
Script.on('SettingChange', (res) => {
    all = Database('world-settings').getCollection();
});
Script.on('wsInit', () => {
    all = Database('world-settings').getCollection();
    init = true;
});
system.runSchedule(() => {
    for (const player of world.getPlayers({})) {
        if (!player.hasTag(adminTag))
            player.runCommandAsync(`gamemode ${all?.defaultGamemode}`);
        if (!all?.pvp)
            player.addEffect(MinecraftEffectTypes.weakness, 20, 255, false),
                player.addEffect(MinecraftEffectTypes.regeneration, 20, 255, false);
        if (!all.hunger)
            player.addEffect(MinecraftEffectTypes.saturation, 20, 255, false);
    }
});
world.events.beforeExplosion.subscribe((res) => {
    if (!all.tnt && res.source.typeId === MinecraftEntityTypes.tnt.id)
        res.cancel = true;
    if (!all.endCrystal && res.source.typeId === MinecraftEntityTypes.enderCrystal.id)
        res.cancel = true;
});
world.events.beforeChat.subscribe((res) => {
    if (!all.chat)
        res.cancel = true,
            res.sender.tell({ rawtext: [{ translate: 'api.ws.chat.disabled' }] }),
            res.sender.playSound('random.break', { volume: .2 });
});
world.events.blockBreak.subscribe((res) => {
    if (!all.breakBlocks)
        res.block.setPermutation(res.brokenBlockPermutation),
            res.player.tell({ rawtext: [{ translate: 'api.ws.break.disabled' }] });
});
world.events.blockPlace.subscribe((res) => {
    if (!all.placeBlocks)
        res.block.setType(MinecraftBlockTypes.air),
            res.player.tell({ rawtext: [{ translate: 'api.ws.place.disabled' }] });
});
world.events.beforeItemUseOn.subscribe((res) => {
    if (!(res.source instanceof Player))
        return;
    const block = res.source.dimension.getBlock(res.blockLocation);
    if (!all.useSwitchesAndDoors &&
        (block.typeId.endsWith('door') ||
            block.typeId.endsWith('button') ||
            block.typeId === MinecraftBlockTypes.lever.id)) {
        res.cancel = true;
        res.source.tell({ rawtext: [{ translate: 'api.ws.switchesanddoors.disabled' }] });
    }
    const containers = [
        MinecraftBlockTypes.chest.id,
        MinecraftBlockTypes.trappedChest.id,
        MinecraftBlockTypes.barrel.id
    ];
    if (!all.openContainers && (containers.includes(block.typeId) || block.typeId.includes('shulker')))
        res.cancel = true,
            res.source.tell({ rawtext: [{ translate: 'api.ws.containers.disabled' }] });
});
/**
 * This will work on 1.19.60+
 */
/**
world.events.playerSpawn.subscribe((res) => {
    if (res.initialSpawn)
        res.player.tell({ rawtext: [ { text: all?.welcomeMessage } ] })
})
*/
