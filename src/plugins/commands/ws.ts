import { Items, ItemStack } from "@minecraft/server";
import { itemId, itemName } from "../../config";
import { Command } from "../../lib/Command";

new Command({
    name: 'gui',
    description: 'Get gui item',
    aliases: ['g'],
    admin: true
}, (plr) => {
    const item = new ItemStack(Items.get(itemId), 1, 0)
    item.nameTag = itemName
    //@ts-ignore
    plr.getComponent('inventory').container.addItem(item)
})