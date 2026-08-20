import { defineMessages } from 'react-intl'

/**
 * These strings are resolved against the translation namespace that is attached
 * to the custom page in Contentful (see CustomPageWrapper), falling back to the
 * default messages below.
 */
export const m = defineMessages({
  eyebrow: {
    id: 'web.askTheBudgetBill:eyebrow',
    defaultMessage: 'Gervigreindaraðstoð',
    description: 'Lítill texti fyrir ofan fyrirsögnina',
  },
  heading: {
    id: 'web.askTheBudgetBill:heading',
    defaultMessage: 'Spurðu fjárlagafrumvarpið',
    description: 'H1 titill á síðunni',
  },
  intro: {
    id: 'web.askTheBudgetBill:intro',
    defaultMessage:
      'Spurðu um það sem þú vilt vita úr fjárlagafrumvarpinu og fáðu svar á mannamáli.',
    description: 'Inngangstexti undir fyrirsögninni',
  },
  inputLabel: {
    id: 'web.askTheBudgetBill:inputLabel',
    defaultMessage: 'Spurning',
    description: 'Merking á innsláttarreit, falin sjónrænt',
  },
  inputPlaceholder: {
    id: 'web.askTheBudgetBill:inputPlaceholder',
    defaultMessage: 'Spurðu um fjárlagafrumvarpið...',
    description: 'Ábending í innsláttarreit',
  },
  inputHint: {
    id: 'web.askTheBudgetBill:inputHint',
    defaultMessage: 'Enter sendir spurninguna, Shift + Enter byrjar nýja línu.',
    description: 'Leiðbeining um lyklaborðsnotkun',
  },
  send: {
    id: 'web.askTheBudgetBill:send',
    defaultMessage: 'Senda spurningu',
    description: 'Merking á sendihnappi',
  },
  suggestionsTitle: {
    id: 'web.askTheBudgetBill:suggestionsTitle',
    defaultMessage: 'Dæmi um spurningar',
    description: 'Titill fyrir ofan tillögur að spurningum',
  },
  suggestionOne: {
    id: 'web.askTheBudgetBill:suggestionOne',
    defaultMessage: 'Hvernig breytast framlög til heilbrigðismála?',
    description: 'Tillaga að spurningu',
  },
  suggestionTwo: {
    id: 'web.askTheBudgetBill:suggestionTwo',
    defaultMessage: 'Hvað segir frumvarpið um menntamál?',
    description: 'Tillaga að spurningu',
  },
  suggestionThree: {
    id: 'web.askTheBudgetBill:suggestionThree',
    defaultMessage: 'Hver er áætluð afkoma ríkissjóðs?',
    description: 'Tillaga að spurningu',
  },
  chatTitle: {
    id: 'web.askTheBudgetBill:chatTitle',
    defaultMessage: 'Spjall um fjárlagafrumvarpið',
    description: 'Titill efst í spjallglugganum',
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
    description: 'Fyrirvari um svör gervigreindarinnar',
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
