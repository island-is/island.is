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
        'Hér er yfirlit yfir samning um breytt lögheimili. __Þú og {otherParent}__ þurfa að staðfesta með undirritun áður en umsóknin fer í afgreiðslu hjá sýslumanni.',
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
    otherParentContactInformation: {
      id:
        'crc.application:section.contract.overview.labels.otherParentContactInformation',
      defaultMessage: 'Tengiliðaupplýsingar hins foreldrisins',
      description: 'Label for other parent contact information',
    },
    currentResidence: {
      id: 'crc.application:section.contract.overview.labels.currentResidence',
      defaultMessage:
        'Núverandi lögheimili {count, plural, =0 {barns} one {barns} other {barna}}:',
      description: 'Label for current residence',
    },
    newResidence: {
      id: 'crc.application:section.contract.overview.labels.newResidence',
      defaultMessage:
        'Nýtt lögheimili {count, plural, =0 {barns} one {barns} other {barna}}:',
      description: 'Label for new residence',
    },
  }),
}
