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
    alertMessage: {
      id: 'an.application:attachments.labels.alertMessage',
      defaultMessage: 'Athugið',
      description:
        'Label for alert message when send certificate later is selected',
    },
  }),
}
