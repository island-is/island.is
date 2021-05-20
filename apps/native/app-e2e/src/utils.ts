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
}

export const launchAsynchronizedApp = (
  { timeout }: { timeout: number } = { timeout: 20000 },
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
        console.log('launchAsynchronizedApp: complete')
        done()
      })
    setTimeout(() => {
      console.log('launchAsynchronizedApp: timeout')
      done()
    }, timeout)
  })
