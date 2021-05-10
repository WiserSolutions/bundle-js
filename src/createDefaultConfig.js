import { resolve } from 'path'
import WebpackNotifierPlugin from 'webpack-notifier'
import { DefinePlugin } from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import LiveReloadPlugin from 'webpack-livereload-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import HtmlPlugin from 'html-webpack-plugin'
import flatten from 'lodash.flatten'
import mapValues from 'lodash.mapvalues'

import { getGitCommit } from './getGitCommit'

const MODE = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production'
}

export const createDefaultConfig = ({
  mode = MODE.DEVELOPMENT,
  context = resolve('./src'),
  entry = './index.js',
  rules = [],
  output = {
    path: resolve('./dist')
  },
  html = true,
  htmlOptions = {},
  less = true,
  lessOptions = {},
  watch,
  watchOptions = {
    ignored: ['node_modules', 'cypress', `${output.path}/**/*`]
  },
  notify = true,
  inject = {},
  plugins = [],
  optimization = {}
} = {}) => {
  const isDev = mode === MODE.DEVELOPMENT
  return {
    mode: isDev ? MODE.DEVELOPMENT : MODE.PRODUCTION,
    context,
    entry: flatten(['@babel/polyfill', entry]),
    output: {
      filename: isDev ? 'bundle.js' : 'bundle-[contenthash].js',
      ...output
    },
    watch: isDev && watch !== false,
    watchOptions,
    devtool: isDev ? 'inline-source-map' : undefined,

    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        ...(less
          ? [
              {
                test: /\.less$/,
                use: [
                  { loader: 'style-loader' },
                  { loader: 'css-loader' },
                  {
                    loader: 'less-loader',
                    options: { lessOptions }
                  }
                ]
              }
            ]
          : []),
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'babel-loader'
            },
            {
              loader: 'react-svg-loader',
              options: {
                svgo: {
                  plugins: [{ removeTitle: false }, { removeViewBox: false }],
                  floatPrecision: 2
                }
              }
            }
          ]
        },
        {
          // image & font loader (base64 with fallback)
          test: /\.jpe?g$|\.gif$|\.png$|\.wav$|\.mp3|\.woff$|\.woff2$|\.otf$|\.eot$|\.ttf$/,
          type: 'asset',
          generator: {
            filename: '[path][name].[contenthash].[ext]'
          }
        },
        ...rules
      ]
    },

    plugins: [
      new DefinePlugin(
        mapValues(
          {
            __MODE__: mode,
            __GIT_COMMIT__: getGitCommit(),
            ...inject
          },
          ::JSON.stringify
        )
      ),
      ...(html
        ? [
            new HtmlPlugin({
              template: resolve(__dirname, './index.html.ejs'),
              ...htmlOptions
            })
          ]
        : []),
      ...(notify ? [new WebpackNotifierPlugin({ alwaysNotify: true })] : []),
      ...(isDev ? [new LiveReloadPlugin({ appendScriptTag: true })] : [new CompressionPlugin()]),
      ...plugins
    ],

    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: 6
          }
        })
      ],
      splitChunks: {
        chunks: 'all'
      },
      ...optimization
    }
  }
}
