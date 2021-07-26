import { defineMessages } from 'react-intl'

export const fishingCompanyInfo = {
  general: defineMessages({
    name: {
      id: 'an.application:fishingCompanyInfo.general.name',
      defaultMessage: 'Slysatilkynning til Sjúkratryggingar Íslands ',
      description: 'Accident notification to Sjúkratryggingar Íslands',
    },
    title: {
      id: 'an.application:fishingCompanyInfo.general.title',
      defaultMessage: 'Upplýsingar um útgerð',
      description: 'Information about fishing company',
    },
    description: {
      id: 'an.application:fishingCompanyInfo.general.description',
      defaultMessage:
        'Vinsamlegast fylltu út upplýsingar um útgerð sem slasaði starfaði hjá þegar slysið átti sér stað.',
      description: `Please fill in the details of the fishing company with whom the injured person was working at the time of the accident.`,
    },
  }),
  labels: defineMessages({
    descriptionField: {
      id: 'an.application:fishingCompanyInfo.labels.descriptionField',
      defaultMessage: 'Upplýsingar um forsvarsmann útgerðar',
      description: `Information about the fishing company's representative`,
    },
    nationalId: {
      id: 'an.application:fishingCompanyInfo.labels.nationalId',
      defaultMessage: 'Kennitala útgerðar',
      description: 'National ID of fishing company',
    },
    name: {
      id: 'an.application:fishingCompanyInfo.labels.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    email: {
      id: 'an.application:fishingCompanyInfo.labels.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    tel: {
      id: 'an.application:fishingCompanyInfo.labels.tel',
      defaultMessage: 'Símanúmer',
      description: 'Telephone number',
    },
    checkBox: {
      id: 'an.application:fishingCompanyInfo.labels.checkBox',
      defaultMessage:
        'Ég er forsvarsmaður hjá útgerð þar sem slysið átti sér stað.',
      description:
        'I am a representative of the fishing company where the accident took place.',
    },
  }),
}
