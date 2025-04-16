import {
  CommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

import { prisma } from "../../prisma";

export default {
  data: new SlashCommandBuilder()
    .setName("liste")
    .setDescription("Liste des membres inscrits au Spotted"),

  async execute(interaction: CommandInteraction) {
    const users = await prisma.user.findMany();

    const content =
      users.length === 0
        ? ":frowning2: Personne"
        : users
            .map(
              (user) =>
                `<@${user.discordId}> - ${user.ASNGUsername} Max: ${user.maxPosition}`,
            )
            .join("\n");

    return interaction.reply({
      content: `Liste des inscrits au concours :
${content}
`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
