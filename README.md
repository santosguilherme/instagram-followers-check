# instagram-followers-check
This is a simple app to try the usage of [Puppeteer](https://pptr.dev/).

The app generates some lists with who are your followers, who you follow and the users who you follow and don't follow you.

## Running
1. Create a `.env` file on the root directory.

1. Create these two variables with your instagram username and password
```ssh
INSTAGRAM_USERNAME=your-username
INSTAGRAM_PASSWORD=your-password
```

1. Run the this following script on the terminal
```ssh
yarn build
```

1. Check the `dist` folder with the output files

## Todo
- [x] Add TypeScript
- [ ] Move to a monorepo
- [ ] Use Atlas Mongo to store the results
- [ ] Fix the Flaky results
- [ ] Add folder structure
 