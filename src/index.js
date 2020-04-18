import puppeteer from 'puppeteer';
import differenceBy from 'lodash.differenceby';
import dotenv from 'dotenv';

dotenv.config();

import getFollowersAndFollowing from './getFollowersAndFollowing.mjs';
import {createDistDirectory} from './distDirectory.mjs';
import {write} from './jsonFile.mjs';

function createOutput({following, followers}){
  console.log(`followers: ${followers.length}`);
  write('followers', followers);

  // FIXME: Flaky
  console.log(`following: ${following.length}`);
  write('following', following);

  const doNotFollowYou = differenceBy(following, followers, 'username');
  write('result', doNotFollowYou);
  console.log('do not follow you:', doNotFollowYou.length);
}

async function start() {
  const username = process.env.INSTAGRAM_USERNAME;
  const password = process.env.INSTAGRAM_PASSWORD;

  createDistDirectory();

  // FIXME: Não funciona com `headless: fasle`
  const browser = await puppeteer.launch({headless: false, devtools: true});
  const page = await browser.newPage();

  const users = await getFollowersAndFollowing(page, {username, password});

  createOutput(users);

  await browser.close();
}

try {
  start();
} catch (e) {
  console.error(e);
  process.abort();
}
