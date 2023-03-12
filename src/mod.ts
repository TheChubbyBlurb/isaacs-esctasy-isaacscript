import { ISCFeature, upgradeMod } from "isaacscript-common";

const MOD_NAME = "isaacs-ecstasy";
const modVanilla = RegisterMod(MOD_NAME, 1);
const features = [
  ISCFeature.CUSTOM_STAGES,
  ISCFeature.CUSTOM_TRAPDOORS,
  ISCFeature.CUSTOM_HOTKEYS,
] as const;
export const mod = upgradeMod(modVanilla, features);
