import { defineMessages } from 'react-intl'

export const applicant = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.dtdc.application:applicant.general.sectionTitle',
      defaultMessage: 'Umsækjandi',
      description: 'Title of applicant section',
    },
    pageTitle: {
      id: 'ta.dtdc.application:applicant.general.pageTitle',
      defaultMessage: 'Upplýsingar um umsækjanda',
      description: 'Title of applicant page',
    },
  }),
  labels: {
    userInformation: defineMessages({
      subSectionTitle: {
        id: 'ta.dtdc.application:applicant.labels.userInformation.subSectionTitle',
        defaultMessage: 'Persónuupplýsingar',
        description: 'User information sub section title',
      },
      description: {
        id: 'ta.dtdc.application:applicant.labels.userInformation.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
        description: 'User information description',
      },
      nationalId: {
        id: 'ta.dtdc.application:applicant.labels.userInformation.nationalId',
        defaultMessage: 'Kennitala',
        description: 'User information national ID label',
      },
      name: {
        id: 'ta.dtdc.application:applicant.labels.userInformation.name',
        defaultMessage: 'Nafn',
        description: 'User information name label',
      },
      address: {
        id: 'ta.dtdc.application:applicant.labels.userInformation.address',
        defaultMessage: 'Lögheimili',
        description: 'User information address label',
      },
      postalcode: {
        id: 'ta.dtdc.application:applicant.labels.userInformation.postalcode',
        defaultMessage: 'Póstnúmer',
        description: 'User information postalcode label',
      },
      city: {
        id: 'ta.dtdc.application:applicant.labels.userInformation.city',
        defaultMessage: 'Staður',
        description: 'User information city label',
      },
      birthPlace: {
        id: 'ta.dtdc.application:applicant.labels.userInformation.birthPlace',
        defaultMessage: 'Fæðingarstaður',
        description: 'User information birth place label',
      },
      birthCountry: {
        id: 'ta.dtdc.application:applicant.labels.userInformation.birthCountry',
        defaultMessage: 'Fæðingarland',
        description: 'User information birth country label',
      },
      emailPhoneSubtitle: {
        id: 'ta.dtdc.application:applicant.labels.userInformation.emailPhoneSubtitle',
        defaultMessage: 'Vinsamlegast skráðu netfang og símanúmer',
        description: 'User information email phone sub title',
      },
      email: {
        id: 'ta.dtdc.application:applicant.labels.userInformation.email',
        defaultMessage: 'Netfang',
        description: 'User information email label',
      },
      phone: {
        id: 'ta.dtdc.application:applicant.labels.userInformation.phone',
        defaultMessage: 'Gsm númer',
        description: 'User information phone number label',
      },
      qualityPhotoSubtitle: {
        id: 'ta.dtdc.application:applicant.labels.userInformation.qualityPhotoSubtitle',
        defaultMessage: 'Mynd af umsækjanda (sótt úr gagnagrunni)',
        description: 'User information quality photo sub title',
      },
      qualityPhotoAltText: {
        id: 'ta.dtdc.application:applicant.labels.userInformation.qualityPhotoAltText',
        defaultMessage:
          'Þín mynd skv. ökuskírteinaskrá (annars fyrri ökuritakort)',
        description: 'User information quality photo alt text',
      },
      qualitySignatureSubtitle: {
        id: 'ta.dtdc.application:applicant.labels.userInformation.qualitySignatureSubtitle',
        defaultMessage: 'Undurskrift umsækjanda',
        description: 'User information quality signature sub title',
      },
      qualitySignatureAltText: {
        id: 'ta.dtdc.application:applicant.labels.userInformation.qualitySignatureAltText',
        defaultMessage:
          'Þín undirskrift skv. ökuskírteinaskrá (annars fyrri ökuritakort)',
        description: 'User information quality photo alt text',
      },
    }),
    cardDelivery: defineMessages({
      subSectionTitle: {
        id: 'ta.dtdc.application:applicant.labels.cardDelivery.subSectionTitle',
        defaultMessage: 'Afhending korts',
        description: 'Card delivery sub section title',
      },
      description: {
        id: 'ta.dtdc.application:applicant.labels.cardDelivery.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
        description: 'Card delivery description',
      },
      pickDeliveryMethodLabel: {
        id: 'ta.dtdc.application:applicant.labels.cardDelivery.pickDeliveryMethodLabel',
        defaultMessage: 'Hvernig viltu fá kortið afhent?',
        description: 'Pick delivery method label',
      },
      legalDomicileOptionTitle: {
        id: 'ta.dtdc.application:applicant.labels.cardDelivery.legalDomicileOptionTitle',
        defaultMessage: 'Sent á lögheimili',
        description: 'Legal domicile option title',
      },
      transportAuthorityOptionTitle: {
        id: 'ta.dtdc.application:applicant.labels.cardDelivery.transportAuthorityOptionTitle',
        defaultMessage: 'Sótt til Samgöngustofu',
        description: 'Transport authority option title',
      },
      chooseDeliveryNoteTitle: {
        id: 'ta.dtdc.application:applicant.labels.cardDelivery.chooseDeliveryNoteTitle',
        defaultMessage: 'Athugið! ',
        description: 'Choose delivery note title',
      },
      chooseDeliveryNoteText: {
        id: 'ta.dtdc.application:applicant.labels.cardDelivery.chooseDeliveryNoteText',
        defaultMessage:
          'Ökuritakort má einungis afhenda til umsækjanda. Umsækjandi getur veitt öðrum heimild til að sækja kort og skal þá framvísa fullgildu umboði þess efnis.',
        description: 'Choose delivery note text',
      },
      errorTachoNetMessage: {
        id: 'ta.dtdc.application:applicant.labels.cardDelivery.errorTachoNetMessage',
        defaultMessage:
          'Það kom upp villa við að sækja gögn úr Tacho net, reyndu aftur síðar.',
        description: 'Error tacho net message',
      },
      retryTachoNetButtonCaption: {
        id: 'ta.dtdc.application:applicant.labels.cardDelivery.retryTachoNetButtonCaption',
        defaultMessage: 'Reyna aftur',
        description: 'Retry tacho net button caption',
      },
    }),
  },
}
