import { resolve } from 'path'
import get from 'lodash.get'
import set from 'lodash.set'

import { createDefaultConfig } from './createDefaultConfig'

const root = resolve('./')
const rebasePath = path => path.replace(root, '/path/to/pkg')
const pathProps = ['context', 'output.path', 'plugins[1].userOptions.template', 'watchOptions.ignored[2]']
const testableDefaultConfig = options => {
  const config = createDefaultConfig(options)
  pathProps.forEach(prop => set(config, prop, rebasePath(get(config, prop))))
  config.plugins.forEach((plugin, idx) => {
    if (plugin.instanceId) set(config, `plugins[${idx}].instanceId`, '__DYNAMIC__')
  })
  set(config, 'plugins[0].definitions.__GIT_COMMIT__', 'abcdef')
  return config
}

describe('createDefaultConfig', () => {
  it('creates default development config', () => {
    expect(testableDefaultConfig()).toMatchSnapshot()
  })

  it('creates default production config', () => {
    expect(testableDefaultConfig({ mode: 'production' })).toMatchSnapshot()
  })

  it('creates a custom config', () => {
    const theme = {
      primaryColor: 'indigo'
    }
    expect(
      testableDefaultConfig({
        context: '/path/to/pkg/client/src',
        entry: ['./app.js', './libs.js'],
        output: {
          path: '/path/to/pkg/build'
        },
        lessOptions: {
          modifyVars: theme
        },
        notify: false,
        inject: {
          __THEME__: theme
        },
        plugins: [{ custom: 'webpack plugin' }]
      })
    ).toMatchSnapshot()
  })
})
