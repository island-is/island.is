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
  disclaimer: {
    id: 'web.askTheBudgetBill:disclaimer',
    defaultMessage:
      'Svörin eru búin til af gervigreind og geta verið ónákvæm. Þau eru ekki bindandi og koma ekki í stað fjárlagafrumvarpsins sjálfs.',
    description: 'Fyrirvari sem birtist fyrir ofan spjallið',
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
