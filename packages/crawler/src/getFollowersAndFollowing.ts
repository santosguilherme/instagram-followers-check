import { Page } from "puppeteer";
import instagramPage, { getUserProfileURL, url } from "./instagramPageObject";
import { AccountCredentials, UsersType } from "./types";
import { wait } from "./wait";

const getUsers = async (page: Page, username: string, usersType: UsersType) => {
  const usersLinkSelector =
    usersType === "followers"
      ? instagramPage.getFollowers(username)
      : instagramPage.getFollowing(username);
  await page.waitForSelector(usersLinkSelector);
  await page.click(usersLinkSelector);
  const scrollableSection = instagramPage.getUsersList().getSelector();
  await page.waitForSelector(scrollableSection);
  const componentHandle = await page.$(scrollableSection);
  if (!componentHandle) {
    throw new Error(`Element ${scrollableSection} not found!`);
  }
  const boxModel = await componentHandle.boxModel();
  if (!boxModel) {
    throw new Error(
      `Box model for the element ${scrollableSection} not found!`,
    );
  }
  let scrollHeight = boxModel.height;
  let stop = false;
  while (!stop) {
    const result = await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`Element ${selector} not found!`);
      }
      element.scrollTop = element.scrollHeight;
      return {
        scrollHeight: element.scrollHeight,
        scrollTop: element.scrollTop,
      };
    }, scrollableSection);
    await wait(5000);
    stop = scrollHeight === result.scrollHeight;
    scrollHeight = result.scrollHeight;
  }
  const scrollableSectionItems = instagramPage.getUsersList().getListItem();
  await page.waitForSelector(scrollableSectionItems);
  // TODO: alternative approach using await page.$$(scrollableSectionItems)
  const dirtyFollowers = await page.evaluate(
    (scrollableSelector, usernameSelector, nameSelector, followingSelector) => {
      return Array.from(
        document.querySelectorAll(scrollableSelector),
        (element) => {
          return {
            username: element
              .querySelector(usernameSelector)
              ?.textContent?.trim(),
            name: element.querySelector(nameSelector)?.textContent?.trim(),
            following:
              element.querySelector(followingSelector)?.textContent?.trim() ??
              "Seguindo",
          };
        },
      );
    },
    scrollableSectionItems,
    instagramPage.getUsersList().getUsername(),
    instagramPage.getUsersList().getName(),
    instagramPage.getUsersList().getFollowing(),
  );
  return dirtyFollowers.filter(
    ({ username, name, following }) => (username || name) && following,
  );
};

const getFollowers = async (page: Page, username: string) => {
  return await getUsers(page, username, "followers");
};

const getFollowing = async (page: Page, username: string) => {
  return await getUsers(page, username, "following");
};

export const getFollowersAndFollowing = async (
  page: Page,
  user: AccountCredentials,
) => {
  await page.goto(url);
  // await page.waitForSelector(instagramPage.getCookiesDialog().getSelector());
  // await page.click(instagramPage.getCookiesDialog().getAcceptButton());
  await page.waitForSelector(instagramPage.getLoginForm().getSelector());
  await page.type(
    instagramPage.getLoginForm().getUsernameField(),
    user.username,
  );
  await page.type(
    instagramPage.getLoginForm().getPasswordField(),
    user.password,
  );
  await wait(2000);
  await page.click(instagramPage.getLoginForm().getLoginButton());
  await page.waitForSelector(
    instagramPage.getSaveInformationsDialog().getSelector(),
  );
  await page.click(instagramPage.getSaveInformationsDialog().cancelButton());
  await page.waitForSelector(
    instagramPage.getNotificationsDialog().getSelector(),
  );
  await page.click(
    instagramPage.getNotificationsDialog().getCancelNotificationsButton(),
  );
  // await page.click(instagramPage.openProfileMenu());
  // await page.click(instagramPage.getProfile(user.username));
  await page.waitForSelector(instagramPage.getProfile(user.username));
  await Promise.all([
    page.waitForNavigation(),
    page.click(instagramPage.getProfile(user.username)),
    // page.click(getUserProfileURL(user.username)),
  ]);
  const followers = await getFollowers(page, user.username);
  await page.goto(getUserProfileURL(user.username));
  await wait(10000);
  const following = await getFollowing(page, user.username);
  // TODO: add validation based on the numbers displayed
  return {
    followers,
    following,
  };
};
