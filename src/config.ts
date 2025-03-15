import dotenv from "dotenv";

dotenv.config();

const {
  DISCORD_TOKEN,
  DISCORD_APP_ID,
  DISCORD_RESULT_CHANNEL_ID,
  ASNG_BEARER_TOKEN,
} = process.env;

if (
  !DISCORD_TOKEN ||
  !DISCORD_APP_ID ||
  !DISCORD_RESULT_CHANNEL_ID ||
  !ASNG_BEARER_TOKEN
) {
  throw new Error("Missing environment variables");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_APP_ID,
  DISCORD_RESULT_CHANNEL_ID,
  ASNG_BEARER_TOKEN,
};
