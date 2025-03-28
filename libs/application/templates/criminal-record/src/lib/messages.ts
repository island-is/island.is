import { defineMessages } from 'react-intl'

export const m = defineMessages({
  name: {
    id: 'cr.application:name',
    defaultMessage: 'Umsókn um sakavottorð',
    description: `Application's name`,
  },
  criminalRecord: {
    id: 'cr.application:criminalRecord',
    defaultMessage: 'Sakavottorð',
    description: `CriminalRecord`,
  },
  externalDataSection: {
    id: 'cr.application:externalData.section',
    defaultMessage: 'Gagnaöflun',
    description: 'Some description',
  },
  externalDataTitle: {
    id: 'cr.application:application.title',
    defaultMessage: 'Umsókn um sakaskrá',
    description: 'Title of the application',
  },
  externalDataSubTitle: {
    id: 'cr.application:externalData.title',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: 'he following data will be retrieved electronically',
  },
  externalDataAgreement: {
    id: 'cr.application:externalData.agreement',
    defaultMessage: 'Ég hef kynnt mér ofangreint',
    description: 'I understand',
  },
  actionCardDraft: {
    id: 'cr.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardDone: {
    id: 'cr.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
  payment: {
    id: 'cr.application:payment',
    defaultMessage: 'Greiðsla',
    description: 'payment',
  },
  confirmation: {
    id: 'cr.application:confirmation',
    defaultMessage: 'Staðfesting',
    description: 'confirmation',
  },
  confirm: {
    id: 'cr.application:confirm',
    defaultMessage: 'Staðfesta',
    description: 'confirm',
  },
  institutionName: {
    id: 'cr.application:institution',
    defaultMessage: 'Sýslumenn',
    description: `Institution's name`,
  },
  criminalRecordInformationTitle: {
    id: 'cr.application:criminalrecord.title',
    defaultMessage: 'Upplýsingar úr sakaskrá',
    description: 'Information from the criminal record database',
  },
  criminalRecordInformationSubTitle: {
    id: 'cr.application:criminalrecord.subTitle',
    defaultMessage: 'Skjal sem inniheldur sakavottorðið þitt.',
    description: 'Document that contains your criminal record.',
  },
  successTitle: {
    id: 'cr.application:successTitle',
    defaultMessage: 'Umsókn þín um sakavottorð hefur verið staðfest',
    description: '',
  },
  conclusionExpandableDescription: {
    id: 'cr.application:vertificationDescriptionWithLink',
    defaultMessage:
      '* Þú getur nálgast sakavottorðið þitt í [stafrænu pósthólfi á Ísland.is](/minarsidur/postholf).\n* Nánari upplýsingar um sannreyningu má finna á [island.is/sannreyna](https://island.is/sannreyna)',
    description:
      'The description and link for further information about the verification',
  },
  pendingActionApplicationCompletedTitle: {
    id: 'cr.application:pendingActionApplicationCompletedTitle',
    defaultMessage:
      'Umsókn þín hefur verið móttekin og er vottorðið aðgengilegt í stafrænu pósthólfi á Ísland.is.',
    description: 'Title of pending action',
  },
})
