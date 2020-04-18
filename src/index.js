import puppeteer from 'puppeteer';
import differenceBy from 'lodash.differenceby';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const username = process.env.INSTAGRAM_USERNAME;
const password = process.env.INSTAGRAM_PASSWORD;

function getDistPath(){
  const rootPath = process.cwd();

  return path.join(rootPath, 'dist');
}

function readJson(filePath){
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function writeJson(fileName, json){
  const distPath = getDistPath();

  fs.writeFile(path.join(distPath, `${fileName}.json`), JSON.stringify(json, null, 2), function writeJSON(err) {
    if (err) return console.log(err);
  });
}

function wait (ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

function match(followers, following){
  const doNotFollowYou = differenceBy(following, followers, 'username');

  writeJson('result', doNotFollowYou);

  console.log('do not follow you:', doNotFollowYou.length);
}

async function getUsers(page, usersType) {
  await page.click(`a[href="/${username}/${usersType}/"]`); // seguidores

  // isgrP
  await page.waitFor('.isgrP');
  const scrollable_section = '.isgrP';

  const bodyHandle = await page.$(scrollable_section);
  const {height} = await bodyHandle.boxModel();

  let scrollHeight = height;
  let stop = false;

  // FIXME: https://www.screenshotbin.com/blog/handling-lazy-loaded-webpages-puppeteer
  while (!stop) {
    const result = await page.evaluate(selector => {
      const element = document.querySelector(selector);

      element.scrollTop = element.scrollHeight;

      return {
        scrollHeight: element.scrollHeight,
        scrollTop: element.scrollTop
      };
    }, scrollable_section);

    await wait(1000);

    stop = scrollHeight === result.scrollHeight;

    scrollHeight = result.scrollHeight;
  }

  await page.waitFor('.isgrP li');

  const dirtyFollowers = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.isgrP li'), value => {
      return ({
        username: value.querySelector('a.FPmhX.notranslate._0imsa')
          ? value.querySelector('a.FPmhX.notranslate._0imsa').innerText.trim()
          : undefined,
        name: value.querySelector('div._7UhW9.xLCgt.MMzan._0PwGv.fDxYl')
          ? value.querySelector('div._7UhW9.xLCgt.MMzan._0PwGv.fDxYl').innerText.trim()
          : undefined,
        following: value.querySelector('button')
          ? value.querySelector('button').innerText.trim()
          : undefined
      });
    });
  });

  const users = dirtyFollowers.filter(({username, name, following}) => (username || name) && following);

  writeJson(usersType, users);

  return users;
}

async function getFollowers(page) {
  return await getUsers(page, 'followers');
}

async function getFollowing(page) {
  return await getUsers(page, 'following');
}

async function robo() {
  // FIXME: Não funciona com `headless: fasle`
  const browser = await puppeteer.launch({headless: false, devtools: true});
  const page = await browser.newPage();

  await page.goto(`https://instagram.com`);

  await page.waitFor('form');
  await page.type('input[name="username"]', username);
  await page.type('input[name="password"]', password);

  await page.click('button[type="submit"]');

  await page.waitFor('.piCib'); //  notificações
  await page.click('.aOOlW.HoLwm'); // cancelar notificacoes

  await page.click('._2dbep.qNELH.kIKUG'); // perfil
  await page.waitForNavigation(`https://www.instagram.com/${username}/`);

  const followers = await getFollowers(page);

  await page.goto(`https://www.instagram.com/${username}/`);
  await wait(5000);

  const following = await getFollowing(page);

  console.log(`followers: ${followers.length}`);
  console.log(`following: ${following.length}`);

  match(followers, following);

  await browser.close();
}

try {
  const distPath = getDistPath();

  if (!fs.existsSync(distPath)){
    fs.mkdirSync(distPath);
  }

  robo();
} catch (e) {
  console.error(e);
  process.abort();
}
