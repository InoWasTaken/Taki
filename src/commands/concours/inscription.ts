import {
  CommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

import { prisma } from "../../prisma";

export default {
  data: new SlashCommandBuilder()
    .setName("inscription")
    .setDescription("S'inscrire au Spotted")
    .addStringOption((option) =>
      option
        .setName("pseudo_asng")
        .setDescription("Votre pseudo et son tag sous le format Pseudo#Tag")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("position_max")
        .setDescription(
          "Position max pour laquelle vous aurez une notification. Défaut : 200",
        )
        .setMaxValue(200)
        .setMinValue(1),
    ),

  async execute(interaction: CommandInteraction) {
    const discordId = interaction.member?.user.id;
    if (!discordId) {
      throw new Error("Impossible to register");
    }

    const ASNGUsername = interaction.options.get("pseudo_asng", true)?.value;
    const maxPosition = interaction.options.get("position_max")?.value ?? 200;

    if (!ASNGUsername || typeof ASNGUsername !== "string") {
      throw new Error("Impossible to register");
    }

    if (typeof maxPosition !== "number") {
      throw new Error("Impossible to register");
    }

    await prisma.user.upsert({
      where: { discordId },
      create: { discordId, ASNGUsername, maxPosition },
      update: { ASNGUsername, maxPosition },
    });

    return interaction.reply({
      content: `Inscription complétée pour <@${discordId}> avec ${ASNGUsername} (position max: ${maxPosition}) :white_check_mark:`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
