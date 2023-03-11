import { ModCallback } from "isaac-typescript-definitions";
import { ViagraPostUpdate } from "../items/Viagra";

export function postUpdateInit(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_UPDATE, main);
}

function main() {
  ViagraPostUpdate();
  // Add code for new items here.
}
