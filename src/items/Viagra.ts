import { getNPCs, getPlayers, getRandomInt } from "isaacscript-common";
import { CollectibleTypeCustom } from "../enums/CollectibleTypeCustom";

// ModCallback.POST_UPDATE (1)
export function ViagraPostUpdate(): void {
  checkApplyViagraEffect();
}

function checkApplyViagraEffect() {
  for (const player of getPlayers()) {
    if (player.HasCollectible(CollectibleTypeCustom.VIAGRA)) {
      applyViagraEffect(player);
    }
    // TODO - Check if the player has Green Candle.
  }
}

function applyViagraEffect(player: EntityPlayer) {
  for (const npc of getNPCs()) {
    if (shouldApplyViagraEffectToNpc(npc)) {
      // - the source is the player
      // - The durration is 100 frames
      // - The damage is equal to the players damage stat
      npc.AddPoison(EntityRef(player), 100, player.Damage);
    }
  }
}

function shouldApplyViagraEffectToNpc(npc: EntityNPC) {
  return npc.IsVulnerableEnemy() && getRandomInt(1, 500) === 1;
}
