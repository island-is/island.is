import { defineMessages } from 'react-intl'

export const m = defineMessages({
  errorPageHeading: {
    defaultMessage: 'Eitthvað fór úrskeiðis',
    id: 'portals:error-page-heading',
  },
  errorPageText: {
    defaultMessage:
      'Ekki næst samband við vefþjón. Tækniteymið hefur fengið skilaboð og mun skoða málið án tafar.',
    id: 'portals:error-page-text',
  },
  notFound: {
    defaultMessage: 'Síða finnst ekki',
    id: 'portals:not-found',
  },
  notFoundMessage: {
    defaultMessage:
      'Ekkert fannst á slóðinni {path}.\nMögulega hefur síðan verið fjarlægð eða færð til',
    id: 'portals:not-found-msg',
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
    id: 'portals:no-data-title',
    defaultMessage: 'Engin gögn fundust',
  },
  noDataMessage: {
    id: 'portals:no-data-message',
    defaultMessage:
      'Ef þú telur þig eiga gögn sem ættu að birtast hér, vinsamlegast hafðu samband við þjónustuaðila.',
  },
})
