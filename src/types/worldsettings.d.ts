export interface Settings {
     /**
     * This message will be sent to a player who has just joined your server
     * @remarks ```This doesn't work for now, it will be updated in 1.19.60```
     */
     readonly welcomeMessage: string
     /**
      * Non-admin players will be forced to have this gamemode
      */
     readonly defaultGamemode: string
     /**
      * Allow players to attack each other
      */
     readonly pvp: boolean
     /**
      * Allow explosion of TNT
      */
     readonly tnt: boolean
     /**
      * Allow explosion of end crystals
      */
     readonly endCrystal: boolean
     /**
      * Allow players to send messages
      */
     readonly chat: boolean
     /**
      * Enables or disables hunger
      */
     readonly hunger: boolean
     /**
      * Allow block breaking
      */
     readonly breakBlocks: boolean
     /**
      * Allow to place blocks
      */
     readonly placeBlocks: boolean
     /**
      * Allow to use switches and doors
      */
     readonly useSwitchesAndDoors: boolean
     /**
      * Allow open containers
      */
     readonly openContainers: boolean
}