import { REST, Routes } from "discord.js";

import { commands } from "./commands";
import { config } from "./config";

const rest = new REST().setToken(config.DISCORD_TOKEN);

export async function deployCommands() {
  try {
    console.log(
      `Started refreshing ${Object.values(commands).length} application (/) commands.`,
    );

    const data = await rest.put(
      Routes.applicationCommands(config.DISCORD_APP_ID),
      { body: Object.values(commands).map((command) => command.data) },
    );

    console.log(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
}
