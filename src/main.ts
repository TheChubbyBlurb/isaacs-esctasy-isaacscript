import { Keyboard, LevelStage } from "isaac-typescript-definitions";
import { ModCallbackCustom, reloadRoom } from "isaacscript-common";
// import { initCallbacks } from "./callbacks/initPlayer";

import { mod } from "./mod";

import { postUpdateInit } from "./callbacks/postUpdate";

// EntityType.FIDDLEFORD = Isaac.GetEntityTypeByName(fiddleford);

main();
// JezebelStuff();
const TOP_LEFT_CORNER_GRID_INDEX = 32;
const TOP_LEF_CORNER_GRID_INDEX = 32;

mod.AddCallbackCustom(
  ModCallbackCustom.POST_GAME_STARTED_REORDERED,
  postGameStartedReorderedFalse,
  false,
);

function main() {
  registerCallbacks(mod);
  // initCallbacks();
}

function registerCallbacks(mod: Mod) {
  postUpdateInit(mod);

  // Add init functions for new callbacks here.
}

function postGameStartedReorderedFalse() {
  mod.spawnCustomTrapdoor(
    TOP_LEFT_CORNER_GRID_INDEX,
    "Garden Of Eden",
    LevelStage.WOMB_1,
  );
  mod.setHotkey(Keyboard.F1, () => {
    mod.setCustomStage("Garden Of Eden");
    reloadRoom();
  });

  mod.spawnCustomTrapdoor(
    TOP_LEF_CORNER_GRID_INDEX,
    "Garden Of Eden",
    LevelStage.WOMB_1,
  );

  mod.setHotkey(Keyboard.F2, () => {
    mod.setCustomStage("Babylon");
    reloadRoom();
  });
}

// function GardenOfEdenDoor(mod:TrySpawnSecretExit(Animate, Force)) { sus }

Isaac.DebugString("Initiated mod: Isaacs-Ecstasy");

// function JezebelStuff() { LOL }
