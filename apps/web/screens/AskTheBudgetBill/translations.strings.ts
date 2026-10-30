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
      'Fyrirvari um svör gervigreindarinnar. Hlekkir eru skrifaðir beint inn í textann með markdown, t.d. „sjá [skilmála](https://island.is/skilmalar)“, og mega vera fleiri en einn.',
  },
  disclaimerLinkNewTab: {
    id: 'web.askTheBudgetBill:disclaimerLinkNewTab',
    defaultMessage: 'Opnast í nýjum flipa',
    description:
      'Lesið upp fyrir skjálesara á eftir hlekk í fyrirvaranum, sem opnast í nýjum flipa',
  },
  exampleQuestionsTitle: {
    id: 'web.askTheBudgetBill:exampleQuestionsTitle',
    defaultMessage: 'Dæmi um spurningar',
    description: 'Fyrirsögn yfir spurningum sem hægt er að smella á',
  },
  exampleQuestion1: {
    id: 'web.askTheBudgetBill:exampleQuestion1',
    defaultMessage: 'Hvernig breytast framlög til heilbrigðismála?',
    description:
      'Fyrsta dæmið um spurningu. Tómur strengur fjarlægir spurninguna af síðunni.',
  },
  exampleQuestion2: {
    id: 'web.askTheBudgetBill:exampleQuestion2',
    defaultMessage: 'Hvað segir frumvarpið um menntamál?',
    description:
      'Annað dæmið um spurningu. Tómur strengur fjarlægir spurninguna af síðunni.',
  },
  exampleQuestion3: {
    id: 'web.askTheBudgetBill:exampleQuestion3',
    defaultMessage: 'Hver er áætluð afkoma ríkissjóðs?',
    description:
      'Þriðja dæmið um spurningu. Tómur strengur fjarlægir spurninguna af síðunni.',
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

/**
 * The example questions, in the order they are shown. Each one is a string of
 * its own in the CMS, so both the wording and how many of them there are can be
 * changed there, in either language, without the page being touched.
 */
export const exampleQuestionMessages = [
  m.exampleQuestion1,
  m.exampleQuestion2,
  m.exampleQuestion3,
]
