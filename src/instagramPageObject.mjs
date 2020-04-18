export const url = 'https://instagram.com';

export function getUserProfileURL(username) {
  return `https://www.instagram.com/${username}/`;
}

const loginForm = {
  getSelector() {
    return 'form';
  },
  getUsernameField() {
    return 'input[name="username"]';
  },
  getPasswordField() {
    return 'input[name="password"]';
  },
  getLoginButton() {
    return 'button[type="submit"]';
  }
};

const notificationsDialog = {
  getSelector() {
    return '.piCib';
  },
  getCancelNotificationsButton() {
    return '.aOOlW.HoLwm';
  }
};

const usersList = {
  getSelector() {
    return '.isgrP';
  },
  getListItem() {
    return '.isgrP li';
  },
  getUsername(){
    return 'a.FPmhX.notranslate._0imsa';
  },
  getName(){
    return 'div._7UhW9.xLCgt.MMzan._0PwGv.fDxYl';
  },
  getFollowing(){
    return 'button';
  }
};

const page = {
  getLoginForm() {
    return loginForm;
  },
  getNotificationsDialog() {
    return notificationsDialog;
  },
  getProfile() {
    return '._2dbep.qNELH.kIKUG';
  },
  getFollowers(username) {
    return `a[href="/${username}/followers/"]`;
  },
  getFollowing(username) {
    return `a[href="/${username}/following/"]`;
  },
  getUsersList() {
    return usersList;
  }
};

export default page;
