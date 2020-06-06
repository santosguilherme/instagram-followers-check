import instagramPage, {getUserProfileURL, url} from './instagramPageObject.mjs';
import wait from './wait.mjs';

async function getUsers(page, username, usersType) {
  const usersLinkSelector = usersType === 'followers'
    ? instagramPage.getFollowers(username)
    : instagramPage.getFollowing(username);

  await page.click(usersLinkSelector);

  const scrollableSection = instagramPage.getUsersList().getSelector();
  await page.waitFor(scrollableSection);

  const componentHandle = await page.$(scrollableSection);
  const {height} = await componentHandle.boxModel();

  let scrollHeight = height;
  let stop = false;

  while (!stop) {
    const result = await page.evaluate(selector => {
      const element = document.querySelector(selector);
      element.scrollTop = element.scrollHeight;

      return {
        scrollHeight: element.scrollHeight,
        scrollTop: element.scrollTop
      };
    }, scrollableSection);

    await wait(1000);

    stop = scrollHeight === result.scrollHeight;
    scrollHeight = result.scrollHeight;
  }

  const scrollableSectionItems = instagramPage.getUsersList().getListItem();
  await page.waitFor(scrollableSectionItems);

  const dirtyFollowers = await page.evaluate((scrollableSelector, usernameSelector, nameSelector, followingSelector) => {
      return Array.from(document.querySelectorAll(scrollableSelector), value => {
        return ({
          username: value.querySelector(usernameSelector)
            ? value.querySelector(usernameSelector).innerText.trim()
            : undefined,
          name: value.querySelector(nameSelector)
            ? value.querySelector(nameSelector).innerText.trim()
            : undefined,
          following: value.querySelector(followingSelector)
            ? value.querySelector(followingSelector).innerText.trim()
            : undefined
        });
      });
    },
    scrollableSectionItems,
    instagramPage.getUsersList().getUsername(),
    instagramPage.getUsersList().getName(),
    instagramPage.getUsersList().getFollowing(),
  );

  return dirtyFollowers.filter(({username, name, following}) => (username || name) && following);
}

async function getFollowers(page, username) {
  return await getUsers(page, username, 'followers');
}

async function getFollowing(page, username) {
  return await getUsers(page, username, 'following');
}

export default async function getFollowersAndFollowing(page, user) {
  await page.goto(url);

  await page.waitFor(instagramPage.getLoginForm().getSelector());
  await page.type(instagramPage.getLoginForm().getUsernameField(), user.username);
  await page.type(instagramPage.getLoginForm().getPasswordField(), user.password);

  await wait(2000);

  await page.click(instagramPage.getLoginForm().getLoginButton());

  await page.waitFor(instagramPage.getSaveInformationsDialog().getSelector());
  await page.click(instagramPage.getSaveInformationsDialog().cancelButton());

  await page.waitFor(instagramPage.getNotificationsDialog().getSelector());
  await page.click(instagramPage.getNotificationsDialog().getCancelNotificationsButton());

  await page.click(instagramPage.getProfile(user.username));
  await page.waitForNavigation(getUserProfileURL(user.username));

  const followers = await getFollowers(page, user.username);

  await page.goto(getUserProfileURL(user.username));
  await wait(5000);

  const following = await getFollowing(page, user.username);

  return {
    followers,
    following
  };
}
