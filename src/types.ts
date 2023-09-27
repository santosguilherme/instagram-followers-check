type UserResult = {
  username?: string;
  name?: string;
  following?: string;
};

export type Users = {
  following: Array<UserResult>;
  followers: Array<UserResult>;
};

export type AccountCredentials = {
  username: string;
  password: string;
};

export type UsersType = "followers" | "following";
