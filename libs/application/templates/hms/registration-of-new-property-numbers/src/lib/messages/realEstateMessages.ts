import { defineMessages } from 'react-intl'

export const realEstateMessages = defineMessages({
  title: {
    id: 'ronp.application:realEstate.title',
    defaultMessage: 'Fasteignin',
    description: 'Real estate section title',
  },
  multifieldTitle: {
    id: 'ronp.application:realEstate.multifieldTitle',
    defaultMessage: 'Fasteignin',
    description: 'Real estate section multifield title',
  },
  description: {
    id: 'ronp.application:realEstate.description',
    defaultMessage: 'Veldu þá fasteign sem á að stofna ný fasteignanúmer á',
    description: 'Real estate section description',
  },
  realEstateLabel: {
    id: 'ronp.application:realEstate.realEstateLabel',
    defaultMessage: 'Fasteign',
    description: 'Real estate label',
  },
  amountDescription: {
    id: 'ronp.application:realEstate.amountDescription',
    defaultMessage:
      'Veldu fjölda nýrra fasteigna sem á að stofna. Upprunalega fasteignanúmerið helst óbreytt. Eingöngu er sótt um fyrir þær eignir sem eiga að bætast við í skrána.',
    description: 'Real estate amount description',
  },
  costTitle: {
    id: 'ronp.application:realEstate.costTitle',
    defaultMessage: 'Samanlagður kostnaður',
    description: 'Real estate cost title',
  },
  amountTitle: {
    id: 'ronp.application:realEstate.amountTitle',
    defaultMessage: 'Fjöldi nýrra fasteigna',
    description: 'Real estate amount title',
  },
  alert: {
    id: 'ronp.application:realEstate.alert#markdown',
    defaultMessage:
      'Innheimt er {unitPrice} kr. gjald fyrir hverja eign samkvæmt [gjaldskrá Húsnæðis- og mannvirkjastofnunar](https://hms.is/gjaldskra-hms)',
    description: 'Real estate alert message',
  },
  otherCommentsTitle: {
    id: 'ronp.application:realEstate.otherCommentsTitle',
    defaultMessage: 'Annað sem þú vilt að komi fram?',
    description: 'Real estate other comments title',
  },
})
