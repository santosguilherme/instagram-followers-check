import puppeteer from 'puppeteer';
import differenceBy from 'lodash.differenceby';
import dotenv from 'dotenv';

dotenv.config();

import getFollowersAndFollowing from './getFollowersAndFollowing.mjs';
import {createDistDirectory} from './distDirectory.mjs';
import {write} from './jsonFile.mjs';

function createOutput(username, datetime, {following, followers}){
  console.log(`followers: ${followers.length}`);

  // FIXME: Flaky
  console.log(`following: ${following.length}`);

  const result = {
    username,
    datetime,
    following,
    followers,
    doNotFollowYou: differenceBy(following, followers, 'username'),
  };

  write(`${username}-result-${datetime}`, result);
  console.log('do not follow you:', result.doNotFollowYou.length);
}

async function start() {
  const username = process.env.INSTAGRAM_USERNAME;
  const password = process.env.INSTAGRAM_PASSWORD;

  createDistDirectory();

  // FIXME: Não funciona com `headless: fasle`
  const browser = await puppeteer.launch({headless: false, devtools: true});
  const page = await browser.newPage();

  const users = await getFollowersAndFollowing(page, {username, password});

  createOutput(username, Date.now(), users);

  await browser.close();
}

try {
  start();
} catch (e) {
  console.error(e);
  process.abort();
}
