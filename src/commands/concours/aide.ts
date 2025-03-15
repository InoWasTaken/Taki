import {
  CommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("aide")
    .setDescription("Décrit le fonctionnement de Taki"),

  async execute(interaction: CommandInteraction) {
    return interaction.reply({
      content: `Je suis un bot qui permet de s'inscrire et de se désinscrire pour le Spotted du concours de style ASNG.
Je vous enverrai une notification avec votre classement dans le concours, selon votre préférence jusqu'à la 200ème place max.

Liste de mes commandes :
\`/inscription PseudoASNG#Tag PositionMax\`
\`/desinscription\`
\`/liste\`

Si vous n'êtes pas ping lors des résultats, pensez à vérifier votre inscription avec \`/liste\` et de la mettre à jour avec \`/inscription\`.

J'enregistre un compte ASNG par compte Discord. Choisissez bien ! :duck:`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
