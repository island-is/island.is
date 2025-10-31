import { defineMessages } from 'react-intl'

export const powerOfAttorney = {
  labels: defineMessages({
    uploadNow: {
      id: 'an.application:powerOfAttorney.labels.uploadNow',
      defaultMessage: 'Ég er með umboð og vil hlaða upp skjali núna',
      description: 'Label for power of attorney upload now radio button',
    },
    uploadLater: {
      id: 'an.application:powerOfAttorney.labels.uploadLater',
      defaultMessage: 'Ég vil klára að tilkynna slys og skila inn umboði síðar',
      description: 'Label for power of attorney upload now radio button',
    },
    forChildInCustody: {
      id: 'an.application:powerOfAttorney.labels.forChildInCustody',
      defaultMessage: 'Ég er að sækja um fyrir barn sem ég er í forráði fyrir',
      description: 'Label for child in custody radio button',
    },
  }),
  type: defineMessages({
    description: {
      id: 'an.application:powerOfAttorney.type.description',
      defaultMessage: `Athugaðu að það er hægt að tilkynna slys án þess að öll nauðsynleg skjöl séu til staðar en Sjúkratryggingar Íslands kunna að óska eftir frekari gögnum við afgreiðslu málsins, svo taka megi ákvörðun um bótarétt, fjárhæð og greiðslu bóta. 
      Þú getur sótt umboðsskjal til útfyllingar hér umboð.docx`,
      description: 'Description for power of attorney type',
    },
    sectionTitle: {
      id: 'an.application:powerOfAttorney.type.sectionTitle',
      defaultMessage: 'Umboð',
      description: 'Section title of upload section',
    },
    heading: {
      id: 'an.application:powerOfAttorney.type.heading',
      defaultMessage: 'Umboð fyrir tilkynningu',
      description: 'Heading of upload section',
    },
  }),
  alertMessage: defineMessages({
    title: {
      id: 'an.application:powerOfAttorney.alertMessage.title',
      defaultMessage: 'Athugið',
      description:
        'Bold title in alert when uploading required attachment later',
    },
    description: {
      id: 'an.application:powerOfAttorney.alertMessage.description',
      defaultMessage:
        'Það er hægt að bæta við skjölum eftir að umsókn hefur verið send inn. Áður en að Sjúkratryggingar Íslands fer yfir umsókn og tekur afstöðu til bótaskyldu þarf umboð að vera til staðar.',
      description:
        'Description message in Alert when uploading required attachment later',
    },
  }),
  upload: defineMessages({
    heading: {
      id: 'an.application:powerOfAttorney.upload.heading',
      defaultMessage: 'Fylgiskjöl',
      description: 'Heading of upload section',
    },
    description: {
      id: 'an.application:powerOfAttorney.upload.description',
      defaultMessage:
        'Sé verið að tilkynna slys fyrir hönd slasaða skal skila inn skriflegu og undirrituðu umboði þér til handa, staðfestu af tveimur vitundarvottum. Umboðinu skal skila inn sem fylgiskjali með tilkynningunni.',
      description: 'Description of upload section',
    },
    powerOfAttorneyFileLinkText: {
      id: 'an.application:powerOfAttorney.upload.powerOfAttorneyFileLinkText',
      defaultMessage: `Þú getur sótt umboðsskjal hér til útfyllingar.`,
      description: 'Proxy document text followed by link',
    },
    powerOfAttorneyFileLinkButtonName: {
      id: 'an.application:powerOfAttorney.upload.powerOfAttorneyFileLinkButtonName',
      defaultMessage: `Umboð.docx.`,
      description: 'Button title for document provided for power of attorney',
    },
    sectionTitle: {
      id: 'an.application:powerOfAttorney.upload.sectionTitle',
      defaultMessage: 'Fylgiskjöl',
      description: 'Section title of upload section',
    },
    uploadDescription: {
      id: 'an.application:powerOfAttorney.upload.uploadDescription',
      defaultMessage:
        'Tekið er við skjölum með endingunum: .pdf, .docx, .rtf, .jpg, .jpeg, .png, .heic, .heic',
      description: 'Definition of upload description',
    },
    uploadHeader: {
      id: 'an.application:powerOfAttorney.upload.uploadHeader',
      defaultMessage: 'Dragðu umboðsskjal hingað til að hlaða upp',
      description: 'Definition of upload header',
    },
    uploadButtonLabel: {
      id: 'an.application:powerOfAttorney.upload.uploadButtonLabel',
      defaultMessage: 'Velja skjöl til að hlaða upp',
      description: 'Definition of upload button label',
    },
  }),
}
