export const environment = {
  metadataProviser: {
    nationalRegistry: {
      baseSoapUrl: 'https://localhost:8443',
      user: process.env.SOFFIA_USER ?? '',
      password: process.env.SOFFIA_PASS ?? '',
      host: 'soffiaprufa.skra.is',
    },
  },
  apiMock: process.env.API_MOCKS === 'true',
}
