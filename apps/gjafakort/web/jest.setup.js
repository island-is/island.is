import locales from './i18n/locales/is.json'

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { apiUrl: '' },
  serverRuntimeConfig: { apiUrl: '' },
}))

jest.mock('./i18n', () => ({
  useI18n: () => ({
    t: (key) => locales[key],
  }),
}))
