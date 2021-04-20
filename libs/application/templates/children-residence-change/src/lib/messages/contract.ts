import { defineMessages } from 'react-intl'

// Contract
export const contract = {
  general: defineMessages({
    pageTitle: {
      id: 'crc.application:section.contract.overview.pageTitle',
      defaultMessage: 'Samningur',
      description: 'Contract page title',
    },
    description: {
      id: 'crc.application:section.contract.overview.description#markdown',
      defaultMessage:
        'Hér er yfirlit yfir samning um breytt lögheimili. __Þú og {otherParent}__ þurfa að staðfesta með undirritun áður en umsóknin fer í afgreiðslu hjá sýslumanni.\\n\\nBreyting á lögheimili og þar með á greiðslu meðlags og barnabóta tekur gildi eftir að sýslumaður hefur staðfest samninginn.',
      description: 'Contract page description',
    },
  }),
  labels: defineMessages({
    childName: {
      id: 'crc.application:section.contract.overview.labels.childName',
      defaultMessage:
        '{count, plural, =0 {Nafn barns} one {Nafn barns} other {Nöfn barna}}',
      description: 'Label for a child names',
    },
    contactInformation: {
      id: 'crc.application:section.contract.overview.labels.contactInformation',
      defaultMessage: 'Tengiliðaupplýsingar þínar',
      description: 'Label for parent contact information',
    },
    currentResidence: {
      id: 'crc.application:section.contract.overview.labels.currentResidence',
      defaultMessage: 'Núverandi lögheimilisforeldri:',
      description: 'Label for current residence',
    },
    newResidence: {
      id: 'crc.application:section.contract.overview.labels.newResidence',
      defaultMessage: 'Nýtt lögheimilisforeldri:',
      description: 'Label for new residence',
    },
  }),
  childBenefit: defineMessages({
    label: {
      id: 'crc.application:section.contract.overview.childBenefit.label',
      defaultMessage: 'Meðlag',
      description: 'Label for child benefit',
    },
    text: {
      id: 'crc.application:section.contract.overview.childBenefit.text',
      defaultMessage: '{otherParent} fær einfalt meðlag mánaðarlega.',
      description: 'Text for child benefit',
    },
  }),
  pdfButton: defineMessages({
    label: {
      id: 'crc.application:section.contract.overview.pdfButton.label',
      defaultMessage: 'Sjá samning á PDF skjali',
      description: 'Label for PDF button',
    },
  }),
}
