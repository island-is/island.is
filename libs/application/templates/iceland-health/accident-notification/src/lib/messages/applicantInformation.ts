import { defineMessages } from 'react-intl'

export const applicantInformation = {
  general: defineMessages({
    name: {
      id: 'an.application:applicantInfo.general.name',
      defaultMessage: 'Slysatilkynning til Sjúkratryggingar Íslands ',
      description: 'Accident notification to Sjúkratryggingar Íslands',
    },
    title: {
      id: 'an.application:applicantInfo.general.title',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Information about you',
    },
    description: {
      id: 'an.application:applicantInfo.general.description#markdown',
      defaultMessage: `Sjúkratryggingar Íslands þurfa þessar upplýsingar til þess að hægt sé að hafa samband við þig á meðan málið er til meðferðar og upplýsa þig um niðurstöðu þess, og til þess að tryggja örugga persónugreiningu.\n\nFylla þarf út stjörnumerkt svæði,  annað er valkvætt.`,
      description: `Sjúkratryggingar Íslands needs this information in order to be able to contact you while the application is being processed and inform you of the institution's decision.`,
    },
  }),
  labels: defineMessages({
    name: {
      id: 'an.application:applicantInfo.labels.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    nationalId: {
      id: 'an.application:applicantInfo.labels.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National ID',
    },
    address: {
      id: 'an.application:applicantInfo.labels.address',
      defaultMessage: 'Heimili / póstfang',
      description: 'Address',
    },
    postalCode: {
      id: 'an.application:applicantInfo.abels.postalCode',
      defaultMessage: 'Póstnúmer',
      description: 'Postal Code',
    },
    city: {
      id: 'an.application:applicantInfo.labels.city',
      defaultMessage: 'Sveitarfélag',
      description: 'City',
    },
    email: {
      id: 'an.application:applicantInfo.labels.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    tel: {
      id: 'an.application:applicantInfo.labels.tel',
      defaultMessage: 'Símanúmer',
      description: 'Telephone number',
    },
  }),
  procure: defineMessages({
    titill: {
      id: 'an.application:applicantInfo.procure.title',
      defaultMessage: 'Upplýsingar um ',
      description: 'Name of the procure identity',
    },
    name: {
      id: 'an.application:applicantInfo.procure.name',
      defaultMessage: 'Nafn',
      description: 'Name of the procure identity',
    },
  }),
  forThirdParty: defineMessages({
    title: {
      id: 'an.application:applicantInfo.forThirdParty.title',
      defaultMessage: 'Upplýsingar um þann slasaða',
      description: 'Information about the injured',
    },
  }),
}
