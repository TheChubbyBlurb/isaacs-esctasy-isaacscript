import { LevelStage, ModCallback } from "isaac-typescript-definitions";
import { mod } from "./mod";

const TOP_LEFT_CORNER_GRID_INDEX = 32;

mod.AddCallback(ModCallback.POST_GAME_STARTED, postGameStarted);

export function postGameStarted(isContinued: boolean) {
  if (isContinued) {
    return;
  }

  mod.spawnCustomTrapdoor(
    TOP_LEFT_CORNER_GRID_INDEX,
    "Slaughterhouse",
    LevelStage.BASEMENT_1,
  );
}

Isaac.DebugString("Initiated mod: isaacscript-mod-example");
