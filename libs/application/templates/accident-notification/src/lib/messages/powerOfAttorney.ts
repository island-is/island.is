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
      defaultMessage: `Sé verið að tilkynna slys fyrir hönd slasaða skal skila inn skriflegu og undirrituðu umboði þér til handa, staðfestu af tveimur vitundarvottum. 
    Umboðinu skal skila inn sem fylgiskjali með tilkynningunni. 
    Þú getur sótt umboðsskjal hér til útfyllingar TODO`,
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
      defaultMessage: 'Hlaða upp umboði',
      description: 'Heading of upload section',
    },
    description: {
      id: 'an.application:powerOfAttorney.upload.description',
      defaultMessage:
        'Athugaðu að það er hægt að tilkynna slys án þess að öll nauðsynleg skjöl eru til staðar.... blabla Þú getur sótt umboðsskjal hér til útfyllingar umboð.docx',
      description: 'Description of upload section',
    },
    sectionTitle: {
      id: 'an.application:powerOfAttorney.upload.sectionTitle',
      defaultMessage: 'Hlaða upp umboði',
      description: 'Section title of upload section',
    },
    uploadDescription: {
      id: 'an.application:powerOfAttorney.upload.uploadDescription',
      defaultMessage: 'Tekið er við skjölum með endingunum: .pdf, .docx, .rtf',
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
