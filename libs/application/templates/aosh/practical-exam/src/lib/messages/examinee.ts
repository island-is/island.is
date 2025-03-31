import { defineMessages } from 'react-intl'

export const examinee = {
  general: defineMessages({
    pageTitle: {
      id: 'aosh.pe.application:examinee.general.pageTitle',
      defaultMessage: 'Próftakar',
      description: `Examinee page title`,
    },
    pageDescription: {
      id: 'aosh.pe.application:examinee.general.pageDescription',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: `Examinee page description`,
    },
    sectionTitle: {
      id: 'aosh.pe.application:examinee.general.sectionTitle',
      defaultMessage: 'Próftakar',
      description: `Examinee section title`,
    },
  }),
  labels: defineMessages({
    licenceNumber: {
      id: 'aosh.pe.application:examinee.labels.licenceNumber',
      defaultMessage: 'Ökurskirteinisnúmer',
      description: `Label for the applicant's license number`,
    },
    countryIssuer: {
      id: 'aosh.pe.application:examinee.labels.countryIssuer',
      defaultMessage: 'Útgáfuland ökurskirteinis',
      description: `Label for the country that issued the license`,
    },
    pickCountry: {
      id: 'aosh.pe.application:examinee.labels.pickCountry',
      defaultMessage: 'Velja útgáfuland',
      description: `placeholder for the country that issued the license`,
    },
  }),
  tableRepeater: defineMessages({
    addExamineeButton: {
      id: 'aosh.pe.application:examinee.tableRepeater.addExamineeButton',
      defaultMessage: 'Skrá fleiri leiðbeinendur',
      description: `Text for the button to add another examinee`,
    },
    saveExamineeButton: {
      id: 'aosh.pe.application:examinee.tableRepeater.saveExamineeButton',
      defaultMessage: 'Vista',
      description: `Text for the button to save examinee`,
    },
    examineeValidityErrorTitle: {
      id: 'aosh.pe.application:examinee.tableRepeater.examineeValidityErrorTitle',
      defaultMessage: 'Ekki allir próftakar geta verið skráðir í verklegt próf',
      description: 'Alert message title when there is a invalid examinee',
    },
    examineesGraphQLErrorTitle: {
      id: 'aosh.pe.application:examinee.tableRepeater.examineesGraphQLErrorTitle',
      defaultMessage: 'Villa kom upp að sækja upplýsingar próftaka',
      description:
        'Alert message title when graphql call to validate examinee fails',
    },
    examineesGraphQLError: {
      id: 'aosh.pe.application:examinee.tableRepeater.examineesGraphQLError',
      defaultMessage:
        'Vinasamlegast eyddu út nýjustu færslu og reyndu aftur síðar',
      description: 'Alert message when graphql call to validate examinee fails',
    },
    examineeValidityError: {
      id: 'aosh.pe.application:examinee.tableRepeater.examineeValidityError#markdown',
      defaultMessage: '',
      description: 'Alert message when there is a invalid examinee',
    },
    duplicateError: {
      id: 'aosh.pe.application:examinee.tableRepeater.duplicateError',
      defaultMessage: 'Endurtekning fundin',
      description:
        'Error message when there is a duplicate email, phone or national id',
    },
    removeAllButton: {
      id: 'aosh.pe.application:examinee.tableRepeater.removeAllButton',
      defaultMessage: 'Fjarlægja ógjaldgenga leiðbeinendur',
      description: 'Button label for removing all invalid examinees',
    },
  }),
}
