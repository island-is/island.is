import { defineMessages } from 'react-intl'

export const attachments = {
  general: defineMessages({
    sectionTitle: {
      id: 'an.application:attachments.sectionTitle',
      defaultMessage: 'Fylgiskjöl',
      description: 'Section title for attachments',
    },
    heading: {
      id: 'an.application:attachments.heading',
      defaultMessage: 'Fylgiskjöl',
      description: 'Heading for attachments',
    },
    description: {
      id: 'an.application:attachments.description',
      defaultMessage: `Svo hægt sé að klára afgreiðslu tilkynningar þurfa öll nauðsynleg fylgiskjöl að berast Sjúkratryggingum Íslands.
			 Ef þig vantar enn einhver fylgiskjöl, getur þú samt sem áður sent tilkynninguna inn og skilað fylgiskjölum síðar.`,
      description: 'Description for attachments',
    },
    alertMessage: {
      id: 'an.application:attachments.alertMessage',
      defaultMessage: `Mögulegt er að bæta við fylgiskjölum eftir að tilkynning hefur verið send til Sjúkratrygginga Íslands. 
      Áður en hægt er að taka afstöðu til tilkynningar og bótaskyldu þurfa áverkavottorð eða tilkynningarseðill frá
       Landspítala Íslands hins vegar að vera til staðar og bótaskyldu þarf áverkavottorð frá þeim lækni sem sá slasaða fyrst eða samskiptaseðill
        vegna fyrstu komu frá Landspítala að vera til staðar.`,
      description: 'Alert message when send certificate later is selecte',
    },
    uploadSubSectionTitle: {
      id: 'an.application:attachments.uploadSubSectionTitle',
      defaultMessage: 'Hlaða upp',
      description: 'Title for attachment upload subsection',
    },
    uploadTitle: {
      id: 'an.application:attachments.uploadTitle',
      defaultMessage: 'Hlaða upp fylgiskjali',
      description: 'Title of subsection for attachment upload',
    },
    uploadDescription: {
      id: 'an.application:attachments.uploadDescription',
      defaultMessage: 'Tekið er við skjölum með endingunum: .pdf, .docx, .rtf',
      description: 'Definition of upload description',
    },
    uploadHeader: {
      id: 'an.application:attachments.uploadHeader',
      defaultMessage: 'Dragðu viðhengi hingað til að hlaða upp',
      description: 'Definition of upload header',
    },
    uploadButtonLabel: {
      id: 'an.application:attachments.uploadButtonLabel',
      defaultMessage: 'Velja viðhengi til að hlaða upp',
      description: 'Definition of upload button label',
    },
    uploadIntroduction: {
      id: 'an.application:attachments.uploadIntroduction',
      defaultMessage: `Athugaðu að það er hægt að tilkynna slys án þess að öll nauðsynleg skjöl
       eru til staðar en Sjúkratryggingar Íslands kunna að óska eftir frekari gögnum
       við afgreiðslu málsins, svo taka megi ákvörðun um bótarétt, fjárhæð og greiðslu bóta.`,
      description: 'Upload introduction',
    },
  }),
  labels: defineMessages({
    injuryCertificate: {
      id: 'an.application:attachments.injuryCertificate',
      defaultMessage: 'Ég er með áverkavottorð og vil hlaða því upp núna',
      description: 'Label for injuryCertificate',
    },
    hospitalSendsCertificate: {
      id: 'an.application:attachments.hospitalSendsCertificate',
      defaultMessage:
        'Ég mun óska eftir því að Landspítalinn sendi  samskiptaseðill frá bráðamóttöku',
      description: 'Label for hospital sends certificate',
    },
    sendCertificateLater: {
      id: 'an.application:attachments.sendCertificateLater',
      defaultMessage:
        'Ég vil klára að tilkynna slys en skila áverkavottorði síðar',
      description: 'Label for send certificate later',
    },
    injuredSendsCertificate: {
      id: 'an.application:attachments.injuredSendsCertificate',
      defaultMessage: 'Ég óska eftir að hinn slasaði skili inn áverkavottorði',
      description:
        'I request that the injured person submit a certificate of injury',
    },
    alertMessage: {
      id: 'an.application:attachments.labels.alertMessage',
      defaultMessage: 'Athugið',
      description:
        'Label for alert message when send certificate later is selected',
    },
  }),
  documentNames: defineMessages({
    injuryCertificate: {
      id: 'an.application:attachments.documentNames.injuryCertificate',
      defaultMessage: 'Áverkavottorð',
      description: 'Name of injury certificate for in review',
    },
    deathCertificate: {
      id: 'an.application:attachments.documentNames.deathCertificate',
      defaultMessage: 'Dánarvottorð',
      description: 'Name of death certificate for in review',
    },
    policeReport: {
      id: 'an.application:attachments.documentNames.policeReport',
      defaultMessage: 'Lögregluskýrsla',
      description: 'Name of police report for in review',
    },
    powerOfAttorneyDocument: {
      id: 'an.application:attachments.documentNames.powerOfAttorney',
      defaultMessage: 'Umboð',
      description: 'Name of power of attorney document for in review',
    },
  }),
}
