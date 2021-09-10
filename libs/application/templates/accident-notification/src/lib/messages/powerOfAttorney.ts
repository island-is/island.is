import { defineMessages } from 'react-intl'

export const powerOfAttorney = {
  labels: defineMessages({
    uploadNow: {
      id: 'an.application:powerOfAttorney.labels.uploadNow',
      defaultMessage: 'Ég er með umboð og vil hlaða upp skjali núna',
      description: 'Label for power of attorney upload now radio button',
    },
    uploadLater: {
      id: 'an.application:powerOfAttorney.labels.uploadNow',
      defaultMessage:
        'Ég vil klára að tilkynna slys og skila umboðsskjali síðar',
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
      defaultMessage: 'Fylgiskjöl',
      description: 'Section title of upload section',
    },
    heading: {
      id: 'an.application:powerOfAttorney.type.heading',
      defaultMessage: 'Fylgiskjöl',
      description: 'Heading of upload section',
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
        '<p>Athugaðu að það er hægt að tilkynna slys án þess að öll nauðsynleg skjöl eru til staðar.... blabla</p><br/><p>Þú getur sótt umboðsskjal hér til útfyllingar umboð.docx</p>',
      description: 'Description of upload section',
    },
    sectionTitle: {
      id: 'an.application:powerOfAttorney.upload.sectionTitle',
      defaultMessage: 'Hlaða upp skjali',
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
