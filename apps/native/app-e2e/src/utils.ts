const scopes =
  'openid profile api_resource.scope offline_access @island.is/applications:read'

export const config = {
  identityServer: {
    clientId: '@island.is-app',
    issuer: 'https://identity-server.dev01.devland.is',
    scopes: scopes?.split(' '),
  },
  apiEndpoint: 'https://beta.dev01.devland.is/api',
  bundleId: 'is.island.app-dev',
  phoneNumber: '010-7789',
  debug: false,
}

// @todo CADisplayLink is causing synchronization to hang
//       we can use device.disableSynchronization() but home screen starts inside launchApp
//
// This is an attempt to bypass synchronization and start the app at the same time.
// You must use `waitFor` when checking for screens. `expect` will probably fail because
// detox will not wait for screen load
export const launchAsynchronizedApp = (
  { timeout }: { timeout: number } = { timeout: 15000 },
) =>
  new Promise((resolve) => {
    const done = () => {
      return device.disableSynchronization().then(resolve)
    }
    device
      .launchApp({
        permissions: {
          faceid: 'YES',
          notifications: 'YES',
        },
        url: `${config.bundleId}://e2e/disable-applock`,
      })
      .then(() => {
        config.debug && console.log('launchAsynchronizedApp: complete')
        done()
      })
    setTimeout(() => {
      config.debug && console.log('launchAsynchronizedApp: timeout')
      done()
    }, timeout)
  })
