import defaultConfig from './defaultConfig'

const testableDefaultConfig = options => {
  const config = defaultConfig({ context: '/path/to/pkg/src', output: { path: '/path/to/pkg/dist' }, ...options })
  delete config.plugins[0].definitions.__GIT_COMMIT__
  return config
}

describe('defaultConfig', () => {
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
