# Welcome to Mock Recent Changes!

This was a tool created by [@ShaurGaur](https://github.com/ShaurGaur) for a Wikipedia based study from Carnegie Mellon University ([@CMU-Wikipedia](https://github.com/CMU-Wikipedia)).

## About the Tool

This is a mock version of Wikipedia's [Recent Changes](https://en.wikipedia.org/wiki/Special:RecentChanges?hidebots=1&hidecategorization=1&hideWikibase=1&limit=50&days=7&urlversion=2) tool. It is functionally similar, except that it uses a labeled dataset instead of live edits. In addition, while most of the edit features are included (i.e. differences, page edit history, and user contributions, comments), talk pages and edit dates are not shown.

There are three dimensions of filtering: edit quality, edit intent, and user experience. Quality and intent filters, corresponding to the ORES API's `damaging` and `goodfaith` models respectively, are based on the default configuration as seen in the [ORES/RCFilters MediaWiki page](https://www.mediawiki.org/wiki/ORES/RCFilters#Threshold_configuration_in_the_ORES_extension).

## Configurations

The root URL of the website is https://cmu-wikipedia.github.io/mock-recent-changes/#/.

However, you can add a configuration after the `#/` to alter what the user can see. Be aware that you will have to refresh the page using `Ctrl+R` in your browser window when changing between these.

**The variants are:**

- `<URL>/noflags` - This will only display checkbox filters for the user.
- `<URL>/nocheck` - This will only display color highlights for the user.
- `<URL>/main` or `<URL>` - (default) Displays both filters and highlights.

## Data Collection

This tool **does not** collect any personal data. When the user enters a Diff page, they can "revert" an edit they see as damaging or bad faith. A timestamp (along with `damaging` and `goodfaith` scores for an edit) will be sent to a [Google Sheet](https://docs.google.com/spreadsheets/d/e/2PACX-1vTAolQ1vu-yZrBodbZItzYMC9uqX3vCfjlsA_0N7GtdbIuK_uPUo1S-T3xPIN_zW2sEDo6to6rFrtvz/pubhtml). This data can be analyzed for experimental use.

# Development Commands

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
