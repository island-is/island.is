import { defineMessages } from 'react-intl'

// Select children
export const selectChildren = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.backgroundInformation.selectChildren.sectionTitle',
      defaultMessage: 'Velja barn/börn',
      description: 'Select children section title',
    },
    pageTitle: {
      id: 'crc.application:section.backgroundInformation.selectChildren.pageTitle',
      defaultMessage: 'Veldu barn/börn',
      description: 'Select children page title',
    },
    description: {
      id: 'crc.application:section.backgroundInformation.selectChildren.description#markdown',
      defaultMessage:
        'Hér sérðu lista yfir börn sem eru skráð í þinni forsjá. Þú getur valið fyrir hvaða barn/börn á að flytja lögheimili.\\n\\nAðeins er hægt að velja börn sem eru skráð með sama lögheimili og eiga sömu foreldra.',
      description: 'Select children subtitle',
    },
  }),
  ineligible: defineMessages({
    text: {
      id: 'crc.application:section.backgroundInformation.selectChildren.ineligible.text#markdown',
      defaultMessage:
        'Samkvæmt upplýsingum frá Þjóðskrá Íslands eru eingöngu börn frá núverandi sambýlismaka í þinni forsjá. Hægt er að breyta lögheimili fjölskyldumeðlima með [flutningstilkynningu](https://www.skra.is/umsoknir/rafraen-skil/flutningstilkynning/) til Þjóðskrár Íslands.',
      description:
        'Text when children are not eligible for transfer because their parents live together',
    },
  }),
  checkboxes: defineMessages({
    title: {
      id: 'crc.application:section.backgroundInformation.selectChildren.checkboxes.title',
      defaultMessage: 'Börn í þinni forsjá',
      description: 'Title: displayed above checkboxes',
    },
    subLabel: {
      id: 'crc.application:section.backgroundInformation.selectChildren.checkboxes.sublabel',
      defaultMessage: 'Hitt forsjárforeldrið er {parentName}',
      description: 'Sublabel: displayed below a childs name',
    },
    soleCustodySubLabel: {
      id: 'crc.application:section.backgroundInformation.selectChildren.checkboxes.soleCustodySubLabel',
      defaultMessage: 'Eingöngu í þinni forjá',
      description:
        'Sole custody sublabel: displayed below a childs name when a parent has sole custody',
    },
    livesWithBothParents: {
      id: 'crc.application:section.backgroundInformation.selectChildren.checkboxes.livesWithBothParents',
      defaultMessage:
        'Samkvæmt gögnum frá Þjóðskrá Íslands er {childName} barn sem þú átt með núverandi sambýlismaka. Hægt er að breyta lögheimili þessa barns með flutningstilkynningu annars hvors foreldrisins til Þjóðskrár.',
      description: 'Tooltip: displayed when a child lives with both parents',
    },
    soleCustodyTooltip: {
      id: 'crc.application:section.backgroundInformation.selectChildren.checkboxes.soleCustodyTooltip',
      defaultMessage:
        'Samkvæmt gögnum frá Þjóðskrá Íslands er {childName} eingöngu í þinni forsjá. Til að breyta forsjárskráningu þessa barns er hægt að hafa samband við sýslumann.',
      description:
        'Sole custody Tooltip: displayed when applicant has sole custody',
    },
  }),
}
