import { postUpdateInit } from "./callbacks/postUpdate";

const MOD_NAME = "Isaacs-Ecstasy";

main();

function main() {
  const mod = RegisterMod(MOD_NAME, 1);
  registerCallbacks(mod);
}

function registerCallbacks(mod: Mod) {
  postUpdateInit(mod);
  // Add init functions for new callbacks here.
}
