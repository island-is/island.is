import { defineMessage, defineMessages } from 'react-intl'

const linkText = `Upplýsingar um áætlaðan afgreiðslutíma kvartana má finna á `
const link = `https://www.personuvernd.is/efst-a-baugi/malsmedferdartimi-hja-personuvernd`
const linkName = `vefsíðu Persónuverndar `

const bulletOne = `${linkText} [${linkName}](${link})`

export const confirmation = {
  general: defineMessages({
    pageTitle: {
      id: 'dpac.application:section.overview.pageTitle',
      defaultMessage: 'Yfirlit kvörtunar',
      description: 'overview page title',
    },
  }),
  labels: defineMessage({
    alertTitle: {
      id: 'dpac.application:section.overview.labels.alertMessage',
      defaultMessage: `Umsókn þín hefur verið móttekin!`,
    },
    expandableHeader: {
      id: 'dpac.application:section.overview.labels.expandableHeader',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Expandable header',
    },
    description: {
      id: 'dpac.application:section.overview.labels.description#markdown',
      defaultMessage: `* ${bulletOne}`,
      description: 'Bulletpoints for conclusion screen',
    },
    pdfLink: {
      id: 'dpac.application:section.overview.labels.pdfLink',
      defaultMessage: `Hlaða niður kvörtun á PDF`,
      description: 'Link inside description',
    },
  }),
}
