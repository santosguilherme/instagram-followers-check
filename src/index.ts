import puppeteer from "puppeteer";
import differenceBy from "lodash.differenceby";
import dotenv from "dotenv";

import { getFollowersAndFollowing } from "./getFollowersAndFollowing";
import { createDistDirectory } from "./distDirectory";
import { write } from "./jsonFile";
import { Users } from "./types";

dotenv.config();

const createOutput = (
  username: string,
  datetime: number,
  { following, followers }: Users,
) => {
  const result = {
    username,
    datetime,
    following,
    followers,
    doNotFollowYou: differenceBy(following, followers, "username"),
  };
  write(`${username}-result-${datetime}`, result);
  // FIXME: Flaky
  console.log(
    `followers: ${followers.length} \n following: ${following.length} \n do not follow you: ${result.doNotFollowYou.length}`,
  );
};

const main = async () => {
  const username = process.env.INSTAGRAM_USERNAME;
  const password = process.env.INSTAGRAM_PASSWORD;
  if (!username || !password) {
    throw new Error("User or password env variables not found!");
  }
  createDistDirectory();
  // FIXME: Não funciona com `headless: fasle`
  const browser = await puppeteer.launch({ headless: false, devtools: true });
  const page = await browser.newPage();
  const users = await getFollowersAndFollowing(page, { username, password });
  createOutput(username, Date.now(), users);
  await browser.close();
};

try {
  main();
} catch (e) {
  console.error(e);
  process.abort();
}
