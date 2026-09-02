import { defineMessages } from 'react-intl'

/**
 * These strings are resolved against the translation namespace that is attached
 * to the custom page in Contentful (see CustomPageWrapper), falling back to the
 * default messages below.
 */
export const m = defineMessages({
  heading: {
    id: 'web.askTheBudgetBill:heading',
    defaultMessage: 'Spurðu fjárlagafrumvarpið',
    description: 'H1 titill á síðunni',
  },
  inputPlaceholder: {
    id: 'web.askTheBudgetBill:inputPlaceholder',
    defaultMessage: 'Spurðu um fjárlagafrumvarpið...',
    description: 'Ábending í innsláttarreit',
  },
  send: {
    id: 'web.askTheBudgetBill:send',
    defaultMessage: 'Spyrja',
    description: 'Texti á hnappi sem sendir spurninguna',
  },
  newChat: {
    id: 'web.askTheBudgetBill:newChat',
    defaultMessage: 'Nýtt spjall',
    description: 'Merking á hnappi sem byrjar nýtt samtal',
  },
  disclaimer: {
    id: 'web.askTheBudgetBill:disclaimer',
    defaultMessage:
      'Svörin eru búin til af gervigreind og geta verið ónákvæm. Þau eru ekki bindandi og koma ekki í stað fjárlagafrumvarpsins sjálfs.',
    description:
      'Fyrirvari um svör gervigreindarinnar. Texti sem er vafinn í <link> verður hlekkur á slóðina í disclaimerLinkHref í configJson síðunnar, t.d. á skilmála.',
  },
  chatErrorTitle: {
    id: 'web.askTheBudgetBill:chatErrorTitle',
    defaultMessage: 'Ekki tókst að hlaða spjallinu',
    description: 'Titill á villuskilaboðum ef spjallið hleðst ekki',
  },
  chatErrorMessage: {
    id: 'web.askTheBudgetBill:chatErrorMessage',
    defaultMessage: 'Vinsamlegast reyndu aftur síðar.',
    description: 'Villuskilaboð ef spjallið hleðst ekki',
  },
})
