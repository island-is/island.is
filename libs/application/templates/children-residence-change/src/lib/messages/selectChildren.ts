import { defineMessages } from 'react-intl'

// Select children
export const selectChildren = {
  general: defineMessages({
    sectionTitle: {
      id:
        'crc.application:section.backgroundInformation.selectChildren.sectionTitle',
      defaultMessage: 'Velja barn/börn',
      description: 'Select children section title',
    },
    pageTitle: {
      id:
        'crc.application:section.backgroundInformation.selectChildren.pageTitle',
      defaultMessage: 'Veldu barn/börn',
      description: 'Select children page title',
    },
    description: {
      id:
        'crc.application:section.backgroundInformation.selectChildren.description#markdown',
      defaultMessage:
        'Hér sérðu lista yfir börn sem eru skráð í þinni forsjá. Þú getur valið fyrir hvaða barn/börn á að flytja lögheimili.',
      description: 'Select children subtitle',
    },
  }),
  checkboxes: defineMessages({
    title: {
      id:
        'crc.application:section.backgroundInformation.selectChildren.checkboxes.title',
      defaultMessage: 'Börn í þinni forsjá',
      description: 'Title: displayed above checkboxes',
    },
    subLabel: {
      id:
        'crc.application:section.backgroundInformation.selectChildren.checkboxes.sublabel',
      defaultMessage: 'Hitt forsjárforeldrið er {parentName}',
      description: 'Sublabel: displayed below a childs name',
    },
  }),
}
