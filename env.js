import dotenv from "dotenv";

dotenv.config();

export const {
  OPENNET_RSS_URL,
  POSTGRES_URI,
  GOLOS_CLASSIC_POSTING_KEY,
  STEEM_ACTIVE_CREATOR_KEY,
  STEEM_POSTING_KEY,
} = process.env;
