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
  realEstateNumber: {
    id: 'ronp.application:realEstate.realEstateNumber',
    defaultMessage: 'Fasteignanúmer',
    description: 'Real estate number',
  },
  realEstateSearchPlaceholder: {
    id: 'ronp.application:realEstate.realEstateSearchPlaceholder',
    defaultMessage: 'Sláðu inn fastanúmer',
    description: 'Real estate search placeholder',
  },
  realEstateSearchNotFound: {
    id: 'ronp.application:realEstate.realEstateSearchNotFound',
    defaultMessage: 'Enginn eign fannst fyrir slegið inn fasteignanúmer',
    description: 'Real estate search not found',
  },
  realEstateSearchApiError: {
    id: 'ronp.application:realEstate.realEstateSearchApiError',
    defaultMessage:
      'Villa kom upp í vefþjónustu, vinsamlega reyndu aftur síðar',
    description: 'Real estate search api error',
  },
  realEstateSelectError: {
    id: 'ronp.application:realEstate.realEstateSelectError',
    defaultMessage: 'Vinsamlegast veldu fasteign',
    description: 'Real estate error if user does not choose a real estate',
  },
})
