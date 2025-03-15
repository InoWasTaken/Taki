import { User } from "@prisma/client";

import { Client } from "discord.js";

import { config } from "./config";
import { prisma } from "./prisma";

type Contestant = {
  position: number;
  playerName: string;
  playerTag: string;
};

async function fetchASNG() {
  const url = "https://api.amoursucre-newgen.com/api";
  const headers = {
    Authorization: `Bearer ${config.ASNG_BEARER_TOKEN}`,
    "Content-Type": "application/json",
  };

  let thisContestId: number;
  let thisThemeName: string;
  let nextThemeName: string;
  try {
    const resp = await fetch(`${url}/voting-game`, { headers });
    if (!resp.ok) {
      throw new Error("Request to voting-game failed");
    }

    const json = await resp.json();
    thisContestId = json.data.previousContests[2]?.contestId;
    thisThemeName = json.data.previousContests[2]?.themeName;
    nextThemeName = json.data.activeContests[2]?.themeName;
  } catch (error) {
    console.error("Error while fetching voting-game", { error });
    throw error;
  }

  let startingAt = 1;
  let contestants: Contestant[] = [];
  while (startingAt < 201) {
    try {
      const resp = await fetch(
        `${url}/voting-game/leaderboard/${thisContestId}/starting-at/${startingAt}`,
        { headers },
      );
      if (!resp.ok) {
        throw new Error("Request to voting-game failed");
      }

      const json = await resp.json();
      contestants = [
        ...contestants,
        ...json.data.contestants.map((contestant: any) => ({
          position: contestant.position,
          playerName: contestant.playerName,
          playerTag: contestant.playerTag.toString(),
        })),
      ];
    } catch (error) {
      console.error("Error while fetching voting-game", { error });
      throw error;
    }

    startingAt += 20;
  }

  return { contestants, nextThemeName, thisThemeName };
}

function generateContent(
  users: User[],
  contestants: Contestant[],
  thisThemeName: string,
  nextThemeName: string,
) {
  const matchedContestants: {
    discordId: string;
    position: number;
  }[] = [];

  for (const user of users) {
    for (const contestant of contestants) {
      const [playerName, playerTag] = user.ASNGUsername.split("#");

      if (
        contestant.playerName.toLowerCase() !== playerName.toLowerCase() ||
        contestant.playerTag !== playerTag
      ) {
        continue;
      }

      if (contestant.position > user.maxPosition) {
        continue;
      }

      matchedContestants.push({
        discordId: user.discordId,
        position: contestant.position,
      });
    }
  }

  const sortedContestants = matchedContestants.sort(
    (a, b) => a.position - b.position,
  );

  const currentDate = new Date();
  const isAprilFools =
    currentDate.getMonth() === 3 && currentDate.getDate() === 1;

  let contestResults =
    sortedContestants.length === 0
      ? ":frowning2: Personne"
      : sortedContestants
          .map((mc) => `${mc.position} · <@${mc.discordId}>`)
          .join("\n");

  let content = `:trophy: Résultats pour le thème : ${thisThemeName} :trophy:

${contestResults}

Prochain thème : ${nextThemeName} :sparkles:`;

  if (isAprilFools) {
    content = `:fish: statluséR ruop el emèht : ${thisThemeName} :fish:

𓆝 𓆟 𓆞 𓆟 𓆝

${contestResults}

.° ｡𖦹˚ 𓆝 ｡𖦹°‧

niahcorP emèht : ${nextThemeName} :fishing_pole_and_fish:`;
  }

  return content;
}

async function postResults(client: Client, content: string) {
  const channel = await client.channels.fetch(config.DISCORD_RESULT_CHANNEL_ID);
  if (!channel) {
    console.error("Could not fetch result channel");
    return;
  }

  if (!channel.isSendable()) {
    console.error("!channel.isSendable()");
    return;
  }

  channel.send(content);
}

export async function fetchPostResults(client: Client) {
  const { contestants, nextThemeName, thisThemeName } = await fetchASNG();

  const users = await prisma.user.findMany();
  const content = generateContent(
    users,
    contestants,
    thisThemeName,
    nextThemeName,
  );

  postResults(client, content);
}
