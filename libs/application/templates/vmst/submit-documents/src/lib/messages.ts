import { defineMessages } from 'react-intl'

export const prereq = defineMessages({
  title: {
    id: 'vmst.vsd.prereq:title',
    defaultMessage: 'Vinnumálastofnun',
    description: 'Prerequisite service provider title',
  },
  subtitle: {
    id: 'vmst.vsd.prereq:subtitle',
    defaultMessage: 'Gögn sótt til Vinnumálastofnunar',
    description: 'Prerequisite service provider subtitle',
  },
  checkbox: {
    id: 'vmst.vsd.prereq:checkbox',
    defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
    description: 'Prerequisite checkbox text',
  },
})

export const uploadDocuments = defineMessages({
  title: {
    id: 'vmst.vsd.uploadDocuments:title',
    defaultMessage: 'Skila gögnum',
    description: 'Upload documents title',
  },
  multiFieldDescription: {
    id: 'vmst.vsd.uploadDocuments:multiFieldDescription',
    defaultMessage:
      'Vinsamlegast skilaðu þeim gögnum sem vantar upp á hér að neðan. Hægt er að hlaða upp einu í einu en þú getur bætt við línu ef þú ætlar að skila fleiri gögnum í einu.',
    description: 'Upload documents description',
  },
  sectionStepTitle: {
    id: 'vmst.vsd.uploadDocuments:sectionStepTitle',
    defaultMessage: 'Hlaða upp gögnum',
    description: 'Upload documents section step title',
  },
})

export const application = defineMessages({
  name: {
    id: 'vmst.vsd.application:name',
    defaultMessage: 'Skila gögnum',
    description: `Application's name`,
  },
  institutionName: {
    id: 'vmst.vsd.application:institution',
    defaultMessage: 'Vinnumálastofnun',
    description: `Institution's name`,
  },
  actionCardPrerequisites: {
    id: 'vmst.vsd.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  actionCardDraft: {
    id: 'vmst.vsd.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in draft',
  },
  actionCardSubmitted: {
    id: 'vmst.vsd.application:actionCardSubmitted',
    defaultMessage: 'Innsend',
    description:
      'Description of application state/status when application is submitted',
  },
  agreeCheckbox: {
    id: 'vmst.vsd.application:agreeCheckbox',
    defaultMessage: 'Ég skil',
    description: 'Agree checkbox label',
  },
  successSubmissionTitle: {
    id: 'vmst.vsd.application:successSubmissionTitle',
    defaultMessage:
      'Vinnumálastofnun hefur móttekið umsókn þína og er hún komin til afgreiðslu.',
    description: 'Successful submission title',
  },
})
