import { validateCustomEnum } from "isaacscript-common";

export const PlayerTypeCustom = {
  JEZEBEL: Isaac.GetPlayerTypeByName("Jezebel"),
  JEZEBEL_B: Isaac.GetPlayerTypeByName("Jezebel"),
} as const;

validateCustomEnum("PlayerTypeCustom", PlayerTypeCustom);
