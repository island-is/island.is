import {
  AccidentNotificationAnswers,
  AccidentTypeEnum,
  WhoIsTheNotificationForEnum,
  WorkAccidentTypeEnum,
} from '@island.is/application/templates/accident-notification'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { join } from 'path'
import {
  ApplicationSubmit,
  Atvinnurekandi,
  EmployerEntity,
  Slys,
  TilkynnandiOrSlasadi,
} from './types/applicationSubmit'
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

/**
 * Generates Xml correctly formatted for each type of SÍ application
 * The order of the elements is important as an incorrect order
 * will result in an Invalid Xml error from SÍ
 * @param answers - The answers to the accident notification
 * @param attachments - The attachments names and base64 Content
 * @returns The application Xml correctly formatted for SÍ application
 */
export const applictionAnswersToXml = (
  answers: AccidentNotificationAnswers,
  attachments: AccidentNotificationAttachments[],
): string => {
  const fylgiskjol = {
    fylgiskjol: {
      fylgiskjal: attachments.map((attachment) => {
        return {
          heiti: attachment.name,
          innihald: attachment.content,
          tegund: '',
        }
      }),
    },
  }

  const applicationJson: ApplicationSubmit = {
    slysatilkynning: {
      tilkynnandi: {
        kennitala: answers.applicant.nationalId,
        nafn: answers.applicant.name,
        heimili: answers.applicant.address,
        stadur: answers.applicant.city,
        postfang: answers.applicant.postalCode,
        netfang: answers.applicant.email,
        fyrirhvernerveridadtilkynna: whoIsTheNotificationForToId(
          answers.whoIsTheNotificationFor.answer,
        ),
        simi: answers.applicant.phoneNumber,
      },
      slasadi: injuredPerson(answers),
      slys: accident(answers),
      atvinnurekandi: employer(answers),
      ...fylgiskjol,
    },
  }
  console.log('applicationJson ', JSON.stringify(applicationJson, null, 4))
  const xml = `<?xml version="1.0" encoding="ISO-8859-1"?>${objectToXML(
    applicationJson,
  )}`

  return xml
}

const whoIsTheNotificationForToId = (
  value: WhoIsTheNotificationForEnum,
): number => {
  switch (value) {
    case WhoIsTheNotificationForEnum.ME:
      return 1
    case WhoIsTheNotificationForEnum.JURIDICALPERSON:
      return 2
    case WhoIsTheNotificationForEnum.POWEROFATTORNEY:
      return 3
    case WhoIsTheNotificationForEnum.CHILDINCUSTODY:
      return 4
  }
}

const injuredPerson = (
  answers: AccidentNotificationAnswers,
): TilkynnandiOrSlasadi => {
  const person =
    answers.whoIsTheNotificationFor.answer === WhoIsTheNotificationForEnum.ME
      ? answers.applicant
      : answers.injuredPersonInformation
  return {
    kennitala: person.nationalId,
    nafn: person.name,
    netfang: person.email,
    simi: person.phoneNumber,
  }
}

const accident = (answers: AccidentNotificationAnswers): Slys => {
  const accidentBase = {
    tegund: accidentTypeToId(answers.accidentType.radioButton),
    undirtegund: !answers.workAccident
      ? undefined
      : workAccidentTypeToId(answers.workAccident.type),

    dagsetningslys: answers.accidentDetails.dateOfAccident,
    timislys: answers.accidentDetails.timeOfAccident,
    lysing: answers.accidentDetails.descriptionOfAccident,
    banaslys: yesOrNoToNumber(answers.wasTheAccidentFatal),
    bilslys: yesOrNoToNumber(answers.carAccidentHindrance),
    stadurslysseferindi: answers.locationAndPurpose?.location ?? '',
    lysingerindis: 'lysingerindis ', //TODO find correct field
  }

  switch (answers.accidentType.radioButton) {
    case AccidentTypeEnum.HOMEACTIVITIES: {
      return {
        ...accidentBase,
        slysvidheimilisstorf: {
          heimili: answers.homeAccident.address,
          postnumer: answers.homeAccident.postalCode,
          sveitarfelag: answers.homeAccident.community,
          nanar: answers.homeAccident.moreDetails,
        },
      }
    }
    case AccidentTypeEnum.SPORTS:
      return accidentBase
    case AccidentTypeEnum.RESCUEWORK:
      return accidentBase
    case AccidentTypeEnum.STUDIES:
      return accidentBase
    case AccidentTypeEnum.WORK: {
      return answers.workMachineRadio === 'yes'
        ? {
            ...accidentBase,
            slysvidvinnu: {
              lysingavinnuvel: answers.workMachine.desriptionOfMachine,
            },
          }
        : accidentBase
    }
  }
}

const employer = (
  answers: AccidentNotificationAnswers,
): Atvinnurekandi | undefined => {
  let employerEntity: EmployerEntity | undefined
  switch (answers.accidentType.radioButton) {
    case AccidentTypeEnum.HOMEACTIVITIES:
      return undefined
    case AccidentTypeEnum.SPORTS:
      employerEntity = answers.sportsClubInfo
      break
    case AccidentTypeEnum.RESCUEWORK:
      employerEntity = answers.rescueSquadInfo
      break
    case AccidentTypeEnum.STUDIES:
      return undefined
    case AccidentTypeEnum.WORK:
      employerEntity = answers.companyInfo
      break
  }
  if (!answers.companyInfo) return undefined
  return {
    fyrirtaekikennitala: employerEntity.nationalRegistrationId,
    fyrirtaekinafn: employerEntity.name,
    forsjaradilinafn: employerEntity.name,
    forsjaradilinetfang: employerEntity.email,
    forsjaradilisimi: employerEntity.phoneNumber || '',
  }
}

const yesOrNoToNumber = (value: string): number => {
  return value === 'yes' ? 1 : 0
}

const accidentTypeToId = (typeEnum: AccidentTypeEnum): number => {
  switch (typeEnum) {
    case AccidentTypeEnum.HOMEACTIVITIES:
      return 7
    case AccidentTypeEnum.SPORTS:
      return 4
    case AccidentTypeEnum.RESCUEWORK:
      return 8
    case AccidentTypeEnum.STUDIES:
      return 9
    case AccidentTypeEnum.WORK:
      return 6
  }
}

const workAccidentTypeToId = (
  typeEnum: WorkAccidentTypeEnum | undefined,
): number | undefined => {
  switch (typeEnum) {
    case WorkAccidentTypeEnum.GENERAL:
      return 1
    case WorkAccidentTypeEnum.FISHERMAN:
      return 2
    case WorkAccidentTypeEnum.PROFESSIONALATHLETE:
      return 3
    case WorkAccidentTypeEnum.AGRICULTURE:
      return 4
    default:
      return undefined
  }
}

export const objectToXML = (obj: object) => {
  let xml = ''
  Object.entries(obj).forEach((entry) => {
    const [key, value] = entry
    if (value === undefined) {
      return
    }
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
