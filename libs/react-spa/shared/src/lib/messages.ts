import { defineMessages } from 'react-intl'

export const m = defineMessages({
  error: {
    id: 'portals:error',
    defaultMessage: 'Villa',
  },
  internalServerErrorTitle: {
    id: 'portals:internal-server-error-title',
    defaultMessage: 'Þjónusta liggur tímabundið niðri',
  },
  internalServerErrorMessage: {
    id: 'portals:internal-server-error-message',
    defaultMessage: 'Vinsamlegast reyndu aftur síðar',
  },
  notFound: {
    id: 'portals:not-found',
    defaultMessage: 'Síðan finnst ekki',
  },
  notFoundMessage: {
    id: 'portals:not-found-msg',
    defaultMessage:
      'Hún gæti hafa verið fjarlægð eða færð til. Prófaðu að fara {link}.',
  },
  notFoundMessageLink: {
    id: 'portals:not-found-msg-link',
    defaultMessage: ' til baka á yfirlitið',
  },
  thirdPartyServiceErrorTitle: {
    id: 'portals:third-party-service-error-title',
    defaultMessage: 'Samband næst ekki',
  },
  thirdPartyServiceErrorMessage: {
    id: 'portals:third-party-service-error-message',
    defaultMessage: 'Villa kom upp í samskiptum við þjónustuaðila',
  },
  noDataTitle: {
    id: 'portals:no-data-title',
    defaultMessage: 'Engin gögn til að birta',
  },
  noDataMessage: {
    id: 'portals:no-data-message',
    defaultMessage:
      'Ef þú telur þig eiga gögn sem ættu að birtast hér,\nvinsamlegast hafðu samband við þjónustuaðila.',
  },
})
