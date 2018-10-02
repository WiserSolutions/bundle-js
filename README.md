# bundle-js

Provides default Webpack config and build scripts for other packages

## Requirements

- `webpack` >= 4
- `@babel/core` >= 7 (and any presets/plugins used in your `.babelrc` config)
- `less` if you want to use Less stylesheets (otherwise you'll need to turn off `less` in the options)

## Use

Install using

```sh
npm install @wisersolutions/bundle-js
```

(together with `webpack`, if you don't already have it). Use the provided `createDefaultConfig`
factory in `webpack.config.js` to create a custom bundle config:

```javascript
const { createDefaultConfig } = require('@wisersolutions/bundle-js')
const { loadAndResolveLessVars } = require('@hon2a/less-vars-to-js')
const { resolve } = require('path')

module.exports = async (env) =>
  createDefaultConfig({
    mode: env,
    //context: resolve('./src'),
    //entry: './index.js',
    //rules: [],
    //output: { path: resolve('./dist') },
    htmlOptions: {
      title: 'My Cool App',
      base: '/'
      // template: './src/index.html.ejs'
      // ...
    },
    favicon: resolve('./src/logo.svg'),
    //less: true,
    lessOptions: {
      modifyVars: await loadAndResolveLessVars('./src/theme.less')
      //plugins: []
      // ...
    },
    //watch,
    //watchOptions: { ignored: ['node_modules', 'cypress', `${output.path}/**/*`] },
    //notify: true,
    inject: {
      __THEME__: await loadAndResolveLessVars('./src/variables.less')
    }
    //plugins: []
  })
```

Run `webpack` to build your app. If `mode` is set to `'development'`, the bundler is started
in dev mode and stays running, watching & rebundling on changes. Otherwise it runs a single
production build.

When using the default `index` template, the application should be rendered into the `#root` element.

## Development

### Install

Install dependencies using:

```sh
npm install
```

### Develop

After you modify sources, run the following (or set up your IDE to do it for you):

- format the code using `npm run format`
- lint it using `npm run lint`
- test it using `npm test`

and fix the errors, if there are any.

### Publish

Publishing is done in two steps:

1. Create a new version tag and push it to the repository:
    ```sh
    npm version <patch|minor|major>
    git push --follow-tags
    ```
1. Build and publish the new version as a npm package:
    ```sh
    npm publish --access public
    ``` 
