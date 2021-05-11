import { defineMessages } from 'react-intl'

// Select children
export const selectChildren = {
  general: defineMessages({
    sectionTitle: {
      id:
        'jca.application:section.backgroundInformation.selectChildren.sectionTitle',
      defaultMessage: 'Velja barn/börn',
      description: 'Select children section title',
    },
    pageTitle: {
      id:
        'jca.application:section.backgroundInformation.selectChildren.pageTitle',
      defaultMessage: 'Veldu barn/börn',
      description: 'Select children page title',
    },
    description: {
      id:
        'jca.application:section.backgroundInformation.selectChildren.description#markdown',
      defaultMessage:
        'Samkvæmt uppflettingu í þjóðskrá ert þú foreldri eftirfarandi barna. Þú getur valið að semja um sameiginlega forsjá fyrir þau börn sem eru í dag í forsjá annars foreldris.\\n\\nEf fleiri en eitt barn er valið er aðeins hægt að velja börn sem eiga sömu foreldra.',
      description: 'Select children subtitle',
    },
  }),
  ineligible: defineMessages({
    text: {
      id:
        'jca.application:section.backgroundInformation.selectChildren.ineligible.text#markdown',
      defaultMessage: 'Einhver skilaboð',
      description:
        'Text when children are not eligible for custody change because of various reasons',
    },
  }),
  checkboxes: defineMessages({
    title: {
      id:
        'jca.application:section.backgroundInformation.selectChildren.checkboxes.title',
      defaultMessage: 'Börn í þinni forsjá',
      description: 'Title: displayed above checkboxes',
    },
    subLabel: {
      id:
        'jca.application:section.backgroundInformation.selectChildren.checkboxes.sublabel',
      defaultMessage: 'Hitt forsjárforeldrið er {parentName}',
      description: 'Sublabel: displayed below a childs name',
    },
  }),
}
