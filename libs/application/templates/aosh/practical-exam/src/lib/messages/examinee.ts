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
}
