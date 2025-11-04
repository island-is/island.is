import { defineMessages } from 'react-intl'

export const companyInfo = {
  general: defineMessages({
    name: {
      id: 'an.application:companyInfo.general.name',
      defaultMessage: 'Slysatilkynning til Sjúkratryggingar Íslands ',
      description: 'Accident notification to Sjúkratryggingar Íslands',
    },
    title: {
      id: 'an.application:companyInfo.general.title',
      defaultMessage: 'Upplýsingar um atvinnurekanda',
      description: 'Information about employer',
    },
    description: {
      id: 'an.application:companyInfo.general.description',
      defaultMessage:
        'Vinsamlegast fylltu út upplýsingar um atvinnurekanda sem hinn slasaði starfaði hjá þegar slysið átti sér stað.',
      description: `Please fill in the details of the employer with whom the injured person was working at the time of the accident.`,
    },
  }),
  labels: defineMessages({
    descriptionField: {
      id: 'an.application:companyInfo.labels.descriptionField',
      defaultMessage: 'Upplýsingar um forsvarsmann fyrirtækisins',
      description: `Information about the company's representative`,
    },
    subDescription: {
      id: 'an.application:companyInfo.labels.subDescription',
      defaultMessage:
        'Athugaðu að forsvarsmaður er sá aðili sem fer yfir tilkynninguna fyrir hönd fyrirtæisins.',
      description: `Sub description about the company's representative`,
    },
    nationalId: {
      id: 'an.application:companyInfo.labels.nationalId',
      defaultMessage: 'Kennitala atvinnurekanda',
      description: 'National ID of employer',
    },
    name: {
      id: 'an.application:companyInfo.labels.name',
      defaultMessage: 'Heiti vinnuveitanda',
      description: 'Label of field for name of employeer',
    },
    email: {
      id: 'an.application:companyInfo.labels.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    tel: {
      id: 'an.application:companyInfo.labels.tel',
      defaultMessage: 'Símanúmer',
      description: 'Telephone number',
    },
    checkBox: {
      id: 'an.application:companyInfo.labels.checkBox',
      defaultMessage:
        'Ég er forsvarsmaður hjá fyrirtækinu þar sem slysið átti sér stað.',
      description:
        'I am a representative of the company where the accident took place.',
    },
  }),
}
