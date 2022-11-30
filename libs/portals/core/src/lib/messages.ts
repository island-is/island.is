import { defineMessages } from 'react-intl'

export const m = defineMessages({
  overview: {
    id: 'service.portal:overview',
    defaultMessage: 'Yfirlit',
  },
  couldNotFetch: {
    id: 'service.portal:could-not-fetch',
    defaultMessage: 'Tókst ekki að sækja',
  },
  somethingWrong: {
    id: 'service.portal:something-went-wrong',
    defaultMessage: 'Eitthvað fór úrskeiðis',
  },
  accessDenied: {
    id: 'service.portal:accessDenied',
    defaultMessage: 'Ekki með aðgang',
  },
  accessNeeded: {
    id: 'service.portal:access-needed',
    defaultMessage: 'Umboð vantar',
  },
  accessNeededText: {
    id: 'service.portal:access-needed-text',
    defaultMessage: 'Umboð vantar',
  },
  accessDeniedText: {
    id: 'service.portal:accessDeniedText',
    defaultMessage:
      'Því miður vantar þig umboð til þess að hafa aðgang að þessu svæði. Vinsamlegast hafðu samband við viðeigandi aðila sem sér um þessi mál.',
  },
  notFound: {
    id: 'service.portal:not-found',
    defaultMessage: 'Síða finnst ekki',
  },
  notFoundMessage: {
    id: 'service.portal:not-found-message',
    defaultMessage:
      'Ekkert fannst á slóðinni {path}. Mögulega hefur síðan verið fjarlægð eða færð til',
  },
})
