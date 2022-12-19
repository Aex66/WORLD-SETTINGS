import { EnchantmentType, ItemStack, MinecraftEnchantmentTypes, Items, Enchantment, Player, world, system } from "@minecraft/server";

interface EnchantmentData {
    id: string;
    level: number
}
export interface ItemData {
    id: string;
    data: number;
    amount: number;
    nameTag: string;
    lore: string[];
    enchantments?: EnchantmentData[]
}
export const getItemData = (item: ItemStack) => {
    const itemData: ItemData = {
      id: item.typeId,
      data: item.data,
      amount: item.amount,
      nameTag: item.nameTag,
      lore: item.getLore(),
      enchantments: [],
    }
    if (!item.hasComponent("enchantments")) return itemData
    const enchants = item.getComponent('enchantments')?.enchantments;
        if (enchants) {
    for (let k in MinecraftEnchantmentTypes) {
        const type: EnchantmentType | MinecraftEnchantmentTypes = MinecraftEnchantmentTypes[k as keyof typeof MinecraftEnchantmentTypes]
        if (!enchants.hasEnchantment(type as EnchantmentType)) continue;
        const enchant = enchants.getEnchantment(type as EnchantmentType);
        itemData.enchantments.push({
          id: enchant.type.id,
          level: enchant.level,
        });
      }
    }
    return itemData;
}
  
/**
   * This function allows you to create a new itemStack instance with the data saved with the getItemData function.
   * @param {ItemData} itemData - The data saved to create a new item
   * @returns {itemStack}
*/
export const newItem = (itemData: ItemData) => {
    const item = new ItemStack(
      Items.get(itemData.id),
      itemData.amount,
      itemData.data
    );
    item.nameTag = itemData.nameTag;
    item.setLore(itemData.lore);
    const enchComp = item.getComponent("enchantments");
    const enchants = enchComp?.enchantments;
    if (enchants) {
      for (let enchant of itemData.enchantments) {
        const key = enchant.id
          .replace("minecraft:", "")
          .replace(/_(.)/g, (match) => match[1].toUpperCase());
        const type = MinecraftEnchantmentTypes[key as keyof typeof MinecraftEnchantmentTypes];
        if (!type) continue;
        enchants.addEnchantment(new Enchantment(type as EnchantmentType, enchant.level));
      }
      enchComp.enchantments = enchants;
    }
    return item;
}

export const getScore = (obj: string, player: Player) => {
  try {
    return world.scoreboard.getObjective(obj)?.getScore(player?.scoreboard)
  } catch {}
} 

export const sleep = (ticks: number): Promise<void> => {
  return new Promise((resolve) => {
    const id = system.runSchedule(() => {
      resolve()
      system.clearRunSchedule(id)
    }, ticks)
  })
}