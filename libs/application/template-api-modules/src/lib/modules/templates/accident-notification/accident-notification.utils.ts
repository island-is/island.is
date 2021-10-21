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
        heimili: answers.applicant.address,
        stadur: answers.applicant.city,
        postfang: answers.applicant.postalCode,
        netfang: answers.applicant.email,
        fyrirhvernerveridadtilkynna: 1,
        simi: answers.applicant.phoneNumber || '',
      },
      slasadi: {
        kennitala: answers.injuredPersonInformation?.nationalId || '2606862759',
        nafn: answers.injuredPersonInformation?.name || 'Ólafur',
        netfang:
          answers.injuredPersonInformation?.email || 'olafur@sendiradid.is',
        simi: answers.injuredPersonInformation?.phoneNumber || '5555555',
      },
      slys: {
        tegund: 4, //4 is sports answers.accidentType.radioButton,
        dagsetningslys: answers.accidentDetails.dateOfAccident,
        timislys: answers.accidentDetails.timeOfAccident,
        lysing: answers.accidentDetails.descriptionOfAccident,
        banaslys: 0, // answers.wasTheAccidentFatal,
        bilslys: 0, //answers.carAccidentHindrance,
        stadurslysseferindi: 'erindi',
        lysingerindis: 'lysing ', //TODO find correct field answers.accidentDetails.descriptionOfInjuries,
        //nafnhafnar: '', // answers.fishermanLocation.answer
        //stadsetninghafnar: '',
      },
      atvinnurekandi: {
        //TODO check if need per type of application
        //forsjaradilikennitala: answers.sportsClubInfo.nationalRegistrationId,
        fyrirtaekikennitala: answers.sportsClubInfo.nationalRegistrationId,
        fyrirtaekinafn: answers.sportsClubInfo.name,
        forsjaradilinafn: answers.sportsClubInfo.name,
        forsjaradilinetfang: answers.sportsClubInfo.email,
        forsjaradilisimi: answers.sportsClubInfo.phoneNumber || '',
      },
      /*
      felagstengsl: {
        kennitala: answers.sportsClubInfo.nationalRegistrationId,
        nafn: answers.sportsClubInfo.name,
        tegundslyss: answers.accidentType.radioButton,
      },*/

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
