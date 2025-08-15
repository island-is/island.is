import { defineMessages } from 'react-intl'

export const cv = {
  general: defineMessages({
    sectionTitle: {
      id: 'aa.application:cv.general.sectionTitle',
      defaultMessage: 'Ferilskrá',
      description: 'CV section title',
    },
    pageTitle: {
      id: 'aa.application:cv.general.pageTitle',
      defaultMessage: 'Ferilskrá',
      description: `CV page title`,
    },
  }),
  labels: defineMessages({
    haveCV: {
      id: 'aa.application:cv.labels.haveCV',
      defaultMessage: 'Áttu ferilskrá?',
      description: 'Do you have a CV question label',
    },
    alertMessage: {
      id: 'aa.application:cv.labels.alertMessage',
      defaultMessage:
        'Ef þú vilt gefa þér tíma í uppfæra ferilskrána og senda hana okkur seinna, þá ekkert mál. Þú getur alltaf hlaðið henni inn eftir að umsókn þín hefur verið samþykkt.',
      description: 'CV alert message label',
    },
    uploadHeader: {
      id: 'aa.application:cv.labels.uploadHeader',
      defaultMessage: 'Ferilskrá',
      description: 'Upload header label',
    },
    uploadDescription: {
      id: 'aa.application:cv.labels.uploadDescription',
      defaultMessage:
        'Tekið er við skjölum með endingu: .pdf, .png, .jpg, .jpeg',
      description: 'Upload description label',
    },
    otherQuestion: {
      id: 'aa.application:cv.labels.otherQuestion',
      defaultMessage: 'Vilt þú koma einhverju öðru á framfæri?',
      description: 'Other question label',
    },
    other: {
      id: 'aa.application:cv.labels.other',
      defaultMessage: 'Annað',
      description: 'Other label',
    },
  }),
}
