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
    csvDescription: {
      id: 'aosh.pe.application:examinee.labels.csvDescription',
      defaultMessage:
        'Ef þú ert að skrá marga próftaka í einu í verkleg próf geturðu hlaðið inn .csv skjali hér. Athugið að .csv skjal yfirskrifar próftaka í töflu',
      description: 'CSV description',
    },
    csvCopy: {
      id: 'aosh.pe.application:examinee.labels.csvCopy',
      defaultMessage: 'Sækja csv sniðmát',
      description: 'Fetch CSV copy',
    },
    csvUpload: {
      id: 'aosh.pe.application:examinee.labels.csvUpload',
      defaultMessage: 'Hlaða inn .csv skjali ',
      description: 'Upload .csv file',
    },
    csvHeader: {
      id: 'aosh.pe.application:examinee.labels.csvHeader',
      defaultMessage: 'Skrá marga próftaka í einu',
      description: 'csv header text',
    },
    csvRemoveButton: {
      id: 'aosh.pe.application:examinee.labels.csvRemoveButton',
      defaultMessage: 'Fjarlægja ógjaldgenga þátttakendur',
      description: 'csv remove button',
    },
  }),
  tableRepeater: defineMessages({
    addExamineeButton: {
      id: 'aosh.pe.application:examinee.tableRepeater.addExamineeButton',
      defaultMessage: 'Skrá fleiri próftaka',
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
      defaultMessage: 'Sumir próftakar eru ekki gildir.',
      description: 'Alert message when there is a invalid examinee',
    },
    duplicateError: {
      id: 'aosh.pe.application:examinee.tableRepeater.duplicateError',
      defaultMessage: 'Endurtekning fundin',
      description:
        'Error message when there is a duplicate email, phone or national id',
    },
    csvDuplicateEmailError: {
      id: 'aosh.pe.application:examinee.tableRepeater.csvDuplicateEmailError',
      defaultMessage:
        'netfang sem er nú þegar skráð. Ekki er hægt að skrá tvo með sama netfangi. Þú getur eytt þátttakanda út og skráð aftur með öðru netfangi. ',
      description: 'csv upload duplicate email error label',
    },
    csvDuplicateNationalId: {
      id: 'aosh.pe.application:examinee.tableRepeater.csvDuplicateNationalId',
      defaultMessage:
        'kennitala sem er nú þegar skráð. Ekki er hægt að skrá tvo með sömu kennitölu. Þú getur eytt próftaka og skráð aðra kennitölu.',
      description: 'csv upload duplicate email error label',
    },
    csvInvalidEmailError: {
      id: 'aosh.pe.application:examinee.tableRepeater.csvInvalidEmailError',
      defaultMessage: 'Ógilt netfang',
      description: 'csv upload invalid email error label',
    },
    csvInvalidPhoneError: {
      id: 'aosh.pe.application:examinee.tableRepeater.csvInvalidPhoneError',
      defaultMessage: 'Ógilt símanúmer',
      description: 'csv upload invalid phone error label',
    },
    csvInvalidNationalId: {
      id: 'aosh.pe.application:examinee.tableRepeater.csvInvalidNationalId',
      defaultMessage: 'Ógild kennitala',
      description: 'csv upload invalid ssn error label',
    },
    removeAllButton: {
      id: 'aosh.pe.application:examinee.tableRepeater.removeAllButton',
      defaultMessage: 'Fjarlægja ógjaldgenga próftaka',
      description: 'Button label for removing all invalid examinees',
    },
    csvLineError: {
      id: 'aosh.pe.application:examinee.tableRepeater.csvLineError',
      defaultMessage: 'Villa í CSV skjali fyrir línur:',
      description: 'Beginning of csv line error',
    },
  }),
}
