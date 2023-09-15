import { defineMessages } from 'react-intl'

export const m = defineMessages({
  error: {
    defaultMessage: 'Villa',
    id: 'portals:error',
  },
  internalServerErrorTitle: {
    defaultMessage: 'Þjónusta liggur tímabundið niðri',
    id: 'portals:internal-server-error-title',
  },
  internalServerErrorMessage: {
    defaultMessage: 'Vinsamlegast reyndu aftur síðar',
    id: 'portals:internal-server-error-message',
  },
  notFound: {
    defaultMessage: 'Síðan finnst ekki',
    id: 'portals:not-found',
  },
  notFoundMessage: {
    defaultMessage:
      'Hún gæti hafa verið fjarlægð eða færð til. Prófaðu að fara {link}.',
    id: 'portals:not-found-msg',
  },
  notFoundMessageLink: {
    defaultMessage: ' til baka á yfirlitið',
    id: 'portals:not-found-msg-link',
  },
  thirdPartyServiceErrorTitle: {
    defaultMessage: 'Samband næst ekki',
    id: 'portals:third-party-service-error-title',
  },
  thirdPartyServiceErrorMessage: {
    defaultMessage: 'Villa kom upp í samskiptum við þjónustuaðila',
    id: 'portals:third-party-service-error-message',
  },
  noDataTitle: {
    defaultMessage: 'Engin gögn til að birta',
    id: 'portals:no-data-title',
  },
  noDataMessage: {
    id: 'portals:no-data-message',
    defaultMessage:
      'Ef þú telur þig eiga gögn sem ættu að birtast hér,\nvinsamlegast hafðu samband við þjónustuaðila.',
  },
})
