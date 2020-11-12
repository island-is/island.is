export default {
  production: true,
  baseApiUrl: window.location.origin,
  identityServer: {
    authority:
      window.location.origin === 'https://umsoknir.staging01.devland.is'
        ? 'https://identity-server.staging01.devland.is'
        : window.location.origin === 'https://umsoknir.island.is'
        ? 'https://innskra.island.is'
        : 'https://identity-server.dev01.devland.is',
  },
}
