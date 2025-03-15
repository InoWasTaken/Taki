import { CronJob } from "cron";
import { Client, Events, GatewayIntentBits, MessageFlags } from "discord.js";

import { commands } from "./commands";
import { config } from "./config";
import { deployCommands } from "./deploy-commands";
import { prisma } from "./prisma";
import { fetchPostResults } from "./results";

async function main() {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  await deployCommands();

  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const command = commands[interaction.commandName];

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      return;
    }

    console.log(
      `${new Date().toISOString()}: User ${interaction.user.globalName} used command ${interaction.commandName} ${JSON.stringify(interaction.options.data)}`,
    );

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  });

  client.login(config.DISCORD_TOKEN);

  const job = new CronJob(
    "30 0 3,15 * * *",
    () => fetchPostResults(client),
    null,
    true,
    "Europe/Stockholm",
  );
  console.log("Created cron job");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
