import {
  CommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

import { prisma } from "../../prisma";

export default {
  data: new SlashCommandBuilder()
    .setName("desinscription")
    .setDescription("Se désinscrire du Spotted"),

  async execute(interaction: CommandInteraction) {
    const discordId = interaction.member?.user.id;
    if (!discordId) {
      throw new Error("Impossible to unregister");
    }

    await prisma.user.delete({
      where: { discordId },
    });

    return interaction.reply({
      content: `Désinscription complétée pour <@${discordId}> :broken_heart:`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
