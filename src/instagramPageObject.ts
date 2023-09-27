export const url = "https://instagram.com";

export const getUserProfileURL = (username: string) => {
  return `https://www.instagram.com/${username}/`;
};

const cookiesDialog = {
  getSelector() {
    return ".piCib";
  },
  getAcceptButton() {
    return "button.aOOlW.bIiDR";
  },
};

const loginForm = {
  getSelector() {
    return "#loginForm";
  },
  getUsernameField() {
    return 'input[name="username"]';
  },
  getPasswordField() {
    return 'input[name="password"]';
  },
  getLoginButton() {
    return 'button[type="submit"]';
  },
};

const saveInformationsDialog = {
  getSelector() {
    return "._aa55";
  },
  cancelButton() {
    return 'div[role="button"]';
  },
};

const notificationsDialog = {
  getSelector() {
    return "._a9-v";
  },
  getCancelNotificationsButton() {
    return "button._a9--._a9_1";
  },
};

const usersList = {
  getSelector() {
    return "._aano";
  },
  getListItem() {
    return "div.x1dm5mii.x16mil14.xiojian.x1yutycm.x1lliihq.x193iq5w.xh8yej3";
  },
  getUsername() {
    return "span._aacl._aaco._aacw._aacx._aad7._aade";
  },
  getName() {
    return "span.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft";
  },
  getFollowing() {
    return "div._aacl._aacn._aacw._aad6";
  },
};

const page = {
  getCookiesDialog() {
    return cookiesDialog;
  },
  getLoginForm() {
    return loginForm;
  },
  getSaveInformationsDialog() {
    return saveInformationsDialog;
  },
  getNotificationsDialog() {
    return notificationsDialog;
  },
  openProfileMenu() {
    return "span._2dbep.qNELH";
  },
  getProfile(username: string) {
    return `a[href="/${username}/"]`;
  },
  getFollowers(username: string) {
    return `a[href="/${username}/followers/"]`;
  },
  getFollowing(username: string) {
    return `a[href="/${username}/following/"]`;
  },
  getUsersList() {
    return usersList;
  },
};

export default page;
