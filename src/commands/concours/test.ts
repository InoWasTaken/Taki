import { CommandInteraction, SlashCommandBuilder } from "discord.js";

import { fetchPostResults } from "../../results";

export default {
  data: new SlashCommandBuilder().setName("test").setDescription("Test"),

  async execute(interaction: CommandInteraction) {
    await fetchPostResults(interaction.client);
    return interaction.reply("ok");
  },
};
