import { ItemStack, MinecraftEnchantmentTypes, Items, Enchantment, world, system } from "@minecraft/server";
export const getItemData = (item) => {
    const itemData = {
        id: item.typeId,
        data: item.data,
        amount: item.amount,
        nameTag: item.nameTag,
        lore: item.getLore(),
        enchantments: [],
    };
    if (!item.hasComponent("enchantments"))
        return itemData;
    const enchants = item.getComponent('enchantments')?.enchantments;
    if (enchants) {
        for (let k in MinecraftEnchantmentTypes) {
            const type = MinecraftEnchantmentTypes[k];
            if (!enchants.hasEnchantment(type))
                continue;
            const enchant = enchants.getEnchantment(type);
            itemData.enchantments.push({
                id: enchant.type.id,
                level: enchant.level,
            });
        }
    }
    return itemData;
};
/**
   * This function allows you to create a new itemStack instance with the data saved with the getItemData function.
   * @param {ItemData} itemData - The data saved to create a new item
   * @returns {itemStack}
*/
export const newItem = (itemData) => {
    const item = new ItemStack(Items.get(itemData.id), itemData.amount, itemData.data);
    item.nameTag = itemData.nameTag;
    item.setLore(itemData.lore);
    const enchComp = item.getComponent("enchantments");
    const enchants = enchComp?.enchantments;
    if (enchants) {
        for (let enchant of itemData.enchantments) {
            const key = enchant.id
                .replace("minecraft:", "")
                .replace(/_(.)/g, (match) => match[1].toUpperCase());
            const type = MinecraftEnchantmentTypes[key];
            if (!type)
                continue;
            enchants.addEnchantment(new Enchantment(type, enchant.level));
        }
        enchComp.enchantments = enchants;
    }
    return item;
};
export const getScore = (obj, player) => {
    try {
        return world.scoreboard.getObjective(obj)?.getScore(player?.scoreboard);
    }
    catch { }
};
export const sleep = (ticks) => {
    return new Promise((resolve) => {
        const id = system.runSchedule(() => {
            resolve();
            system.clearRunSchedule(id);
        }, ticks);
    });
};
