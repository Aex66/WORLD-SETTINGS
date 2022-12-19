import { Player } from "@minecraft/server";

export type EventEmitterEvents = {
    'SettingChange': SettingChangeEvent;
    'wsInit': WsInitEvent
}

export class SettingChangeEvent {
    /**
     * The player who changed the setting
     */
    readonly player: Player
}

export class WsInitEvent {

}