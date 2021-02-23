const isStagingUrl =
  window.location.origin === 'https://beta.staging01.devland.is'
const isProductionUrl = window.location.origin === 'https://island.is'

export default {
  production: true,
  applicationSystem: {
    baseFormUrl: isStagingUrl
      ? 'https://umsoknir.staging01.devland.is'
      : isProductionUrl
      ? ''
      : 'https://umsoknir.dev01.devland.is',
  },
}
