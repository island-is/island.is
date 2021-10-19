import { Application } from '@island.is/application/core'
import { AccidentNotificationAnswers } from '@island.is/application/templates/accident-notification'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { join } from 'path'
import { ApplicationSubmit } from './types/applicationSubmit'
import { AccidentNotificationAttachments } from './types/attachments'

export const pathToAsset = (file: string) => {
  if (isRunningOnEnvironment('local')) {
    return join(
      __dirname,
      `../../../../libs/application/template-api-modules/src/lib/modules/templates/accident-notification/emailGenerators/assets/${file}`,
    )
  }

  return join(__dirname, `./accident-notification-assets/${file}`)
}

export const applictionAnswersToXml = (
  answers: AccidentNotificationAnswers,
  attachments: AccidentNotificationAttachments[],
): string => {
  //Stuff to be done
  const applicationJson: ApplicationSubmit = {
    slysatilkynning: {
      tilkynnandi: {
        kennitala: answers.applicant.nationalId,
        nafn: answers.applicant.name,
        netfang: answers.applicant.email,
        heimili: answers.applicant.address,
        postfang: answers.applicant.postalCode,
        simi: answers.applicant.phoneNumber || '',
        stadur: answers.applicant.city,
      },
      slasadi: {
        kennitala: answers.injuredPersonInformation?.nationalId || '',
        netfang: answers.injuredPersonInformation?.email || '',
        simi: answers.injuredPersonInformation?.phoneNumber || '',
        nafn: answers.injuredPersonInformation?.name || '',
        stadur: '', //not in answers
        heimili: '', //not n answers
        postfang: '', //not in answers
      },
      atvinnurekandi: {
        //TODO check if need per type of application
        //forsjaradilikennitala: answers.sportsClubInfo.nationalRegistrationId,
        forsjaradilinafn: answers.sportsClubInfo.name,
        forsjaradilinetfang: answers.sportsClubInfo.email,
        forsjaradilisimi: answers.sportsClubInfo.phoneNumber || '',
        fyrirtaekikennitala: answers.sportsClubInfo.nationalRegistrationId,
        fyrirtaekinafn: answers.sportsClubInfo.name,
      },
      felagstengsl: {
        kennitala: answers.sportsClubInfo.nationalRegistrationId,
        nafn: answers.sportsClubInfo.name,
        tegundslyss: answers.accidentType.radioButton,
      },
      slys: {
        banaslys: answers.wasTheAccidentFatal,
        dagsetningslys: answers.accidentDetails.dateOfAccident,
        bilslys: answers.carAccidentHindrance,
        lysing: answers.accidentDetails.descriptionOfAccident,
        lysingerindis: 'lysing ', //TODO find correct field answers.accidentDetails.descriptionOfInjuries,
        nafnhafnar: '', // answers.fishermanLocation.answer
        stadsetninghafnar: '',
        stadurslysseferindi: '',
        tegund: answers.accidentType.radioButton,
        timislys: answers.accidentDetails.timeOfAccident,
      },
      fylgiskjol: {
        fylgiskjal: attachments.map((attachment) => {
          return {
            heiti: attachment.name,
            innihald: attachment.content,
            tegund: '',
          }
        }),
      },
    },
  }

  const xml = `<?xml version="1.0" encoding="ISO-8859-1"?>${objectToXML(
    applicationJson,
  )}`

  return xml
}

export const objectToXML = (obj: object) => {
  let xml = ''
  Object.entries(obj).forEach((entry) => {
    const [key, value] = entry
    xml += value instanceof Array ? '' : '<' + key + '>'
    if (value instanceof Array) {
      for (const i in value) {
        xml += '<' + key + '>'
        xml += objectToXML(value[i])
        xml += '</' + key + '>'
      }
    } else if (typeof value == 'object') {
      xml += objectToXML(new Object(value))
    } else {
      xml += value
    }
    xml += value instanceof Array ? '' : '</' + key + '>'
  })
  return xml
}
