import { PlayerVariant } from "isaac-typescript-definitions"; // ActiveSlot, EffectVariant, EntityType,
import { ModCallbackCustom } from "isaacscript-common";
import { CollectibleTypeCustom } from "../enums/CollectibleTypeCustom";
import { Costumes } from "../enums/Costumes";
import { mod } from "../mod";
import { PlayerTypeCustom } from "../types/PlayerTypeCustom";

export function initCallbacks(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_PLAYER_INIT_FIRST,
    initJezebel,
    PlayerVariant.PLAYER,
    PlayerTypeCustom.JEZEBEL,
  );
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_PLAYER_INIT_FIRST,
    initJezebelB,
    PlayerVariant.PLAYER,
    PlayerTypeCustom.JEZEBEL_B,
  );
}

export function initJezebel(player: EntityPlayer): void {
  player.AddNullCostume(Costumes.JEZEBEL_HAIR);

  player.AddCollectible(CollectibleTypeCustom.VIAGRA, 0, false);
  // player.SetPocketActiveItem(CollectibleTypeCustom.BLINK, ActiveSlot.POCKET, false);
}

export function initJezebelB(player: EntityPlayer): void {
  player.AddCollectible(CollectibleTypeCustom.VIAGRA, 0, false);
  player.AddNullCostume(Costumes.JEZEBEL_HAIR);
  // player.SetPocketActiveItem(CollectibleCustom.FRUSTRATION, ActiveSlot.POCKET, false);
}
