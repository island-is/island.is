import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  accidentLocationLabelMapper,
  AccidentNotificationAnswers,
  AccidentTypeEnum,
  CompanyInfo,
  FishermanWorkplaceAccidentShipLocationEnum,
  RepresentativeInfo,
  StudiesAccidentTypeEnum,
  SubmittedApplicationData,
  WhoIsTheNotificationForEnum,
  WorkAccidentTypeEnum,
  Applicant,
  YesOrNo,
  utils,
} from '@island.is/application/templates/accident-notification'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { join } from 'path'
import {
  ApplicationSubmit,
  Atvinnurekandi,
  Slys,
  TilkynnandiOrSlasadi,
} from './types/applicationSubmit'
import { AccidentNotificationAttachment } from './types/attachments'
import { objectToXML } from '../../shared/shared.utils'

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
  attachments: AccidentNotificationAttachment[],
): string => {
  const fylgiskjol = {
    fylgiskjol: {
      fylgiskjal: attachments.map((attachment) => {
        return {
          heiti: attachment.name,
          tegund: attachment.attachmentType as number,
          innihald: attachment.content,
        }
      }),
    },
  }

  const applicationJson: ApplicationSubmit = {
    slysatilkynning: {
      tilkynnandi: {
        kennitala: getValueViaPath(answers, '.applicant.nationalId') as string,
        nafn: getValueViaPath(answers, '.applicant.name') as string,
        heimili: getValueViaPath(answers, 'applicant.address') as string,
        stadur: getValueViaPath(answers, 'applicant.city') as string,
        postfang: getValueViaPath(answers, 'applicant.postalCode') as string,
        netfang: getValueViaPath(answers, 'applicant.email') as string,
        fyrirhvernerveridadtilkynna: whoIsTheNotificationForToId(
          getValueViaPath(
            answers,
            'whoIsTheNotificationFor.answer',
          ) as WhoIsTheNotificationForEnum,
        ),
        simi: getValueViaPath(answers, 'applicant.phoneNumber') as string,
      },
      slasadi: injuredPerson(answers),
      slys: accident(answers),
      atvinnurekandi: employer(answers),
      ...fylgiskjol,
    },
  }

  const xml = `<?xml version="1.0" encoding="ISO-8859-1"?>${objectToXML(
    applicationJson,
  )}`

  return xml
}

export const whiteListedErrorCodes = [
  's801_fyrirt_kennit',
  's801_undirtegund',
  's801_tilkynnandi',
  's801_teg_tilk',
  's801_stads_skipa',
  's801_sly_timislys',
  's801_sly_tegund',
  's801_sly_dags',
  's801_fylgiskjal',
  's801_slasadi',
]

const whoIsTheNotificationForToId = (
  value: WhoIsTheNotificationForEnum,
): number => {
  switch (value) {
    case WhoIsTheNotificationForEnum.ME:
      return 1
    case WhoIsTheNotificationForEnum.POWEROFATTORNEY:
      return 2
    case WhoIsTheNotificationForEnum.JURIDICALPERSON:
      return 3
    case WhoIsTheNotificationForEnum.CHILDINCUSTODY:
      return 4
  }
}

const injuredPerson = (
  answers: AccidentNotificationAnswers,
): TilkynnandiOrSlasadi => {
  const whoIsTheNotificationFor = getValueViaPath(
    answers,
    'whoIsTheNotificationFor.answer',
  ) as WhoIsTheNotificationForEnum
  if (whoIsTheNotificationFor === WhoIsTheNotificationForEnum.CHILDINCUSTODY) {
    return {
      kennitala: getValueViaPath(
        answers,
        'childInCustody.nationalId',
      ) as string,
      nafn: getValueViaPath(answers, 'childInCustody.name') as string,
      netfang: ' ', //the child has no email,
    }
  }
  const person =
    whoIsTheNotificationFor === WhoIsTheNotificationForEnum.ME
      ? (getValueViaPath(answers, 'applicant') as Applicant)
      : (getValueViaPath(answers, 'injuredPersonInformation') as Applicant)
  return {
    kennitala: person.nationalId,
    nafn: person.name,
    netfang: person.email,
    simi: person.phoneNumber,
  }
}

const accident = (answers: AccidentNotificationAnswers): Slys => {
  const accidentType = accidentTypeToId(
    getValueViaPath(answers, 'accidentType.radioButton') as AccidentTypeEnum,
  )
  const accidentBase = {
    tegund: accidentType,
    undirtegund: determineSubType(answers),
    dagsetningslys: getValueViaPath(
      answers,
      'accidentDetails.dateOfAccident',
    ) as string,
    timislys: getValueViaPath(
      answers,
      'accidentDetails.timeOfAccident',
    ) as string,
    lysing: getValueViaPath(
      answers,
      'accidentDetails.descriptionOfAccident',
    ) as string,
    banaslys: yesOrNoToNumber(
      getValueViaPath(answers, 'wasTheAccidentFatal') as YesOrNo,
    ),
    bilslys: yesOrNoToNumber(
      getValueViaPath(answers, 'carAccidentHindrance') as YesOrNo,
    ),
    stadurslysseferindi:
      (getValueViaPath(answers, 'locationAndPurpose?.location') as string) ??
      '',
    lysingerindis: (getValueViaPath(answers, 'accidentLocation') as string)
      ? accidentLocationLabelMapper(
          getValueViaPath(
            answers,
            'accidentLocation.answer',
          ) as keyof typeof accidentLocationLabelMapper,
        )
      : undefined,
  }

  switch (
    getValueViaPath(answers, 'accidentType.radioButton') as AccidentTypeEnum
  ) {
    case AccidentTypeEnum.HOMEACTIVITIES: {
      return {
        ...accidentBase,
        slysvidheimilisstorf: {
          heimili: getValueViaPath(answers, 'homeAccident.address') as string,
          postnumer: getValueViaPath(
            answers,
            'homeAccident.postalCode',
          ) as string,
          sveitarfelag: getValueViaPath(
            answers,
            'homeAccident.community',
          ) as string,
          nanar: getValueViaPath(answers, 'homeAccident.moreDetails') as string,
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
      return work(answers, accidentBase)
    }
  }
}

const work = (
  answers: AccidentNotificationAnswers,
  accidentBase: Slys,
): Slys => {
  const workAccidentType = getValueViaPath(
    answers,
    'workAccident.type',
  ) as WorkAccidentTypeEnum
  if (workAccidentType === WorkAccidentTypeEnum.FISHERMAN) {
    return {
      ...accidentBase,
      slysvidvinnusjomanna: {
        stadsetningskips: shipLocation(answers),
        nafnskips: getValueViaPath(
          answers,
          'fishingShipInfo.shipName',
        ) as string,
        einkennisstafirskips: getValueViaPath(
          answers,
          'fishingShipInfo.shipCharacters',
        ) as string,
      },
    }
  }

  return (getValueViaPath(answers, 'workMachineRadio') as YesOrNo) === 'yes'
    ? {
        ...accidentBase,
        slysvidvinnu: {
          lysingavinnuvel: getValueViaPath(
            answers,
            'workMachine.desriptionOfMachine',
          ) as string,
        },
      }
    : accidentBase
}

const shipLocation = (answers: AccidentNotificationAnswers): number => {
  const location = getValueViaPath(
    answers,
    'shipLocation.answer',
  ) as FishermanWorkplaceAccidentShipLocationEnum
  switch (location) {
    case FishermanWorkplaceAccidentShipLocationEnum.SAILINGORFISHING:
      return 1
    case FishermanWorkplaceAccidentShipLocationEnum.HARBOR:
      return 2
    case FishermanWorkplaceAccidentShipLocationEnum.OTHER:
      return 3
  }
}

const employer = (
  answers: AccidentNotificationAnswers,
): Atvinnurekandi | undefined => {
  const companyInfo = getValueViaPath(answers, 'companyInfo') as CompanyInfo
  const representative = getValueViaPath(
    answers,
    'representative',
  ) as RepresentativeInfo

  // If the juridical person is reporting the company info is the juridical persons information
  if (
    answers.juridicalPerson &&
    answers.applicant &&
    utils.isRepresentativeOfCompanyOrInstitute(answers)
  ) {
    return {
      fyrirtaekikennitala: answers.juridicalPerson.companyNationalId,
      fyrirtaekinafn: answers.juridicalPerson.companyName,
      forsjaradilinafn: answers.applicant.name,
      forsjaradilinetfang: answers.applicant.email,
      forsjaradilisimi: answers.applicant.phoneNumber || '',
    }
  }

  if (
    (getValueViaPath(
      answers,
      'accidentType.radioButton',
    ) as AccidentTypeEnum) === AccidentTypeEnum.HOMEACTIVITIES ||
    !companyInfo ||
    !representative
  ) {
    return undefined
  }

  return {
    fyrirtaekikennitala: companyInfo.nationalRegistrationId,
    fyrirtaekinafn: companyInfo.name,
    forsjaradilinafn: representative.name,
    forsjaradilinetfang: representative.email,
    forsjaradilisimi: representative.phoneNumber || '',
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

const determineSubType = (
  answers: AccidentNotificationAnswers,
): number | undefined => {
  if (
    (getValueViaPath(
      answers,
      'accidentType.radioButton',
    ) as AccidentTypeEnum) === AccidentTypeEnum.WORK
  ) {
    switch (
      getValueViaPath(answers, 'workAccident.type') as WorkAccidentTypeEnum
    ) {
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
  if (
    (getValueViaPath(
      answers,
      'accidentType.radioButton',
    ) as AccidentTypeEnum) === AccidentTypeEnum.STUDIES
  ) {
    switch (
      getValueViaPath(
        answers,
        'studiesAccident.type',
      ) as StudiesAccidentTypeEnum
    ) {
      case StudiesAccidentTypeEnum.INTERNSHIP:
        return 5
      case StudiesAccidentTypeEnum.VOCATIONALEDUCATION:
        return 6
      case StudiesAccidentTypeEnum.APPRENTICESHIP:
        return 7
      default:
        return undefined
    }
  }
  return undefined
}

export const getApplicationDocumentId = (application: Application): number => {
  const subAppData = application.externalData
    .submitApplication as SubmittedApplicationData
  const documentId = subAppData?.data?.documentId
  if (!documentId) {
    throw new Error('No documentId found on application')
  }
  return documentId
}
