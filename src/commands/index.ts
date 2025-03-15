import {
  CommandInteraction,
  InteractionResponse,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

import aide from "./concours/aide";
import desinscription from "./concours/desinscription";
import inscription from "./concours/inscription";
import liste from "./concours/liste";
import test from "./concours/test";

export const commands: Record<
  string,
  {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (
      interaction: CommandInteraction,
    ) => Promise<InteractionResponse<boolean>>;
  }
> = {
  aide,
  inscription,
  desinscription,
  liste,
  ...(process.env.NODE_ENV !== "production" ? { test } : {}),
};
