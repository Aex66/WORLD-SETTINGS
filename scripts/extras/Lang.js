/**
 * Lang file
 */
export const Lang = {
    createDefaultStatusMsg: '§7When you make a kit, all the items in your inventory will be added to the kit, make sure you add the correct items\n§bNote: §cDont use especial chars §a(colors can be added, this special character is allowed) §cin the name, §cdescription, requiredTag or even the nameTags, lores of the items because the database does not support these chars\n\n§rName',
    createArExistKit: '§cAlready exists a kit with the name: %s',
    createSucces: '§aThe §e%s §bkit §ahas been created succesfully',
    createNoName: '§cYou must put a name to the kit',
    createNoItems: '§cUps! You cant create a empty kit',
    createPriceErr1: '§cUps! Wrong syntax for the price!',
    removeDefaultStatusMsg: 'Type §a"CONFIRM" §rto §eCONTINUE §ror §c"CANCEL" §rto §eCANCEL',
    removeSucces: '§aThe §e%s §bkit §ahas been removed succesfully',
    reclaimDefaultStatusMsg: '§f¿§eAre you sure you want to reclaim this kit§f?\n\n§7Kit description:§r %s',
    reclaimSucces: '§eYou have claimed the kit §c%s',
    reclaimSelectDefaultStatusMsg: '§rSelect the kit you want to reclaim',
    viewDefaultStatusMsg: '§rSelect the kit you want to see',
    viewConfirmDefaultStatusMsg: '§bThis is all the information of kit §r§e%s\n\n§r§7Description: §r§b%s\n§7RequiredTag: §r§a%s\n§7OnlyOnce: §r§c%s\n§7Cooldown: §b§d%s\n§7Amount of items: §r§c%s',
    noKitsFound: '§cNo kits found',
    insufficientSlotsCount: '§cYou dont have enough spaces to receive this kit §b(§e%s§b)',
    noPerms: '§cYou dont have permission to reclaim this kit',
    inCooldown: '§cYou have §e%s §cleft to reclaim this kit again',
    onlyOnce: "§cUps, this kit was set up for a one-time claim and you've already claimed it!",
    insufficientMoney: '§cUps! You don\'t have enough money',
    purchasedKitSucces: '§eYou have purchased the kit §c%s'
};
export const translate = (LangKey, keys) => {
    if (!Lang[LangKey])
        throw Error('That LangKey does not exist!');
    let msg = Lang[LangKey];
    keys.forEach(key => msg = msg.replace('%s', key));
    return msg;
};
