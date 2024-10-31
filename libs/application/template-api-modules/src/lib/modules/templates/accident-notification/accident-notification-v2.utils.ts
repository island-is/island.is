import {
  AccidentNotificationAttachment,
  AttachmentTypeEnum,
} from './types/attachments'
import { getValueViaPath } from '@island.is/application/core'
import {
  AccidentDetailsV2,
  AccidentNotificationAnswers,
  AccidentTypeEnum,
  ApplicantV2,
  CompanyInfoV2,
  FishermanWorkplaceAccidentLocationEnum,
  FishingShipInfoV2,
  GeneralWorkplaceAccidentLocationEnum,
  HomeAccidentV2,
  InjuredPersonInformationV2,
  RepresentativeInfoV2,
  StudiesAccidentTypeEnum,
  utils,
  WhoIsTheNotificationForEnum,
  WorkAccidentTypeEnum,
  WorkMachineV2,
} from '@island.is/application/templates/accident-notification'
import { YesOrNo } from '@island.is/application/types'
import {
  MinarsidurAPIModelsAccidentReportsAccidentReportDTO,
  MinarsidurAPIModelsAccidentReportsReporterDTO,
  MinarsidurAPIModelsAccidentReportsInjuredDTO,
  MinarsidurAPIModelsAccidentReportsAccidentDTO,
  MinarsidurAPIModelsAccidentReportsEmployerDTO,
  MinarsidurAPIModelsAccidentReportsClubDTO,
  MinarsidurAPIModelsAccidentReportsAccidentReportAttachmentDTO,
  MinarsidurAPIModelsAccidentReportsReporterDTOReportingForEnum,
  MinarsidurAPIModelsAccidentReportsAccidentReportAttachmentTypeEnum,
} from '@island.is/clients/icelandic-health-insurance/rights-portal'

export const applicationToAccidentReport = (
  answers: AccidentNotificationAnswers,
  attachments: Array<AccidentNotificationAttachment>,
): MinarsidurAPIModelsAccidentReportsAccidentReportDTO => {
  return {
    reporter: getReporter(answers),
    injured: getInjured(answers),
    accident: getAccident(answers),
    employer: getEmployer(answers),
    club: getClub(answers),
    attachments: getAttachments(attachments),
  }
}

const reportingForMap = {
  [WhoIsTheNotificationForEnum.ME]:
    MinarsidurAPIModelsAccidentReportsReporterDTOReportingForEnum.NUMBER_1,
  [WhoIsTheNotificationForEnum.JURIDICALPERSON]:
    MinarsidurAPIModelsAccidentReportsReporterDTOReportingForEnum.NUMBER_2,
  [WhoIsTheNotificationForEnum.POWEROFATTORNEY]:
    MinarsidurAPIModelsAccidentReportsReporterDTOReportingForEnum.NUMBER_3,
  [WhoIsTheNotificationForEnum.CHILDINCUSTODY]:
    MinarsidurAPIModelsAccidentReportsReporterDTOReportingForEnum.NUMBER_4,
}

const whoIsTheNotificationForToDTO = (who: WhoIsTheNotificationForEnum) => {
  return (
    reportingForMap[who] ||
    MinarsidurAPIModelsAccidentReportsReporterDTOReportingForEnum.NUMBER_1
  )
}

/*
 * type can be:
 *  4. Íþróttaslys,
 *  6. Vinnuslys,
 *  7. Heimilistrygging,
 *  8. Björgunarmenn,
 *  9. Nemendur við iðnnám
 *
 * type 6 can have the subtypes:
 *  1. Almenn vinna á landi,
 *  2. Vinna sjómanna,
 *  3. Atvinnumennska í íþróttum,
 *  4. Vinna við landbúnað
 *
 * type 9 can have the subtypes:
 *  5. Starfsnám,
 *  6. Verknám við háskóla,
 *  7. Iðnám í löggildum iðngreinum
 */
const accidentTypeMap = {
  [AccidentTypeEnum.SPORTS]: { type: 4 },
  [AccidentTypeEnum.WORK]: { type: 6 },
  [AccidentTypeEnum.HOMEACTIVITIES]: { type: 7 },
  [AccidentTypeEnum.RESCUEWORK]: { type: 8 },
  [AccidentTypeEnum.STUDIES]: { type: 9 },
}

const workAccidentSubtypeMap = {
  [WorkAccidentTypeEnum.GENERAL]: 1,
  [WorkAccidentTypeEnum.FISHERMAN]: 2,
  [WorkAccidentTypeEnum.PROFESSIONALATHLETE]: 3,
  [WorkAccidentTypeEnum.AGRICULTURE]: 4,
}

const studiesAccidentSubtypeMap = {
  [StudiesAccidentTypeEnum.INTERNSHIP]: 5,
  [StudiesAccidentTypeEnum.APPRENTICESHIP]: 6,
  [StudiesAccidentTypeEnum.VOCATIONALEDUCATION]: 7,
}

const getAccidentTypes = (answers: AccidentNotificationAnswers) => {
  const accidentType = getValueViaPath(
    answers,
    'accidentType.answer',
  ) as AccidentTypeEnum
  const workAccidentType = getValueViaPath(
    answers,
    'workAccident.type',
  ) as WorkAccidentTypeEnum
  const studiesAccidentType = getValueViaPath(
    answers,
    'studiesAccident.type',
  ) as StudiesAccidentTypeEnum

  return { accidentType, workAccidentType, studiesAccidentType }
}

const accidentTypeToDTO = (
  answers: AccidentNotificationAnswers,
): { type: number; subtype?: number } => {
  const { accidentType, workAccidentType, studiesAccidentType } =
    getAccidentTypes(answers)

  const baseType = accidentTypeMap[accidentType] || { type: 6 }

  switch (accidentType) {
    case AccidentTypeEnum.WORK:
      return {
        type: baseType.type,
        subtype: workAccidentSubtypeMap[workAccidentType] || 1,
      }
    case AccidentTypeEnum.STUDIES:
      return {
        type: baseType.type,
        subtype: studiesAccidentSubtypeMap[studiesAccidentType],
      }
    default:
      return baseType
  }
}

const locationToDTO = (answers: AccidentNotificationAnswers) => {
  const accidentLocation = getValueViaPath(
    answers,
    'accidentLocation.answer',
  ) as GeneralWorkplaceAccidentLocationEnum

  switch (accidentLocation) {
    case GeneralWorkplaceAccidentLocationEnum.ATTHEWORKPLACE:
      return 0
    case GeneralWorkplaceAccidentLocationEnum.TOORFROMTHEWORKPLACE:
      return 1
    case GeneralWorkplaceAccidentLocationEnum.OTHER:
      return 2
    default:
      return 2
  }
}

const shipLocationToDTO = (answers: AccidentNotificationAnswers) => {
  const accidentLocation = getValueViaPath(
    answers,
    'accidentLocation.answer',
  ) as FishermanWorkplaceAccidentLocationEnum

  switch (accidentLocation) {
    case FishermanWorkplaceAccidentLocationEnum.ONTHESHIP:
      return 1
    case FishermanWorkplaceAccidentLocationEnum.TOORFROMTHEWORKPLACE:
      return 2
    case FishermanWorkplaceAccidentLocationEnum.OTHER:
      return 3
    default:
      return 3
  }
}

const getReporter = (
  answers: AccidentNotificationAnswers,
): MinarsidurAPIModelsAccidentReportsReporterDTO => {
  const applicant = getValueViaPath(answers, 'applicant') as ApplicantV2
  const whoIsTheNotificationFor = getValueViaPath(
    answers,
    'whoIsTheNotificationFor.answer',
  ) as WhoIsTheNotificationForEnum

  const reportingFor = whoIsTheNotificationForToDTO(whoIsTheNotificationFor)

  const reporter = {
    address: applicant.address ?? '',
    city: applicant.city ?? '',
    email: applicant.email ?? '',
    name: applicant.name ?? '',
    nationalId: applicant.nationalId ?? '',
    phoneNumber: applicant.phoneNumber ?? '',
    postcode: applicant.postalCode ?? '',
    reportingFor,
  }

  return reporter
}

const getInjured = (
  answers: AccidentNotificationAnswers,
): MinarsidurAPIModelsAccidentReportsInjuredDTO => {
  const whoIsTheNotificationFor = getValueViaPath(
    answers,
    'whoIsTheNotificationFor.answer',
  ) as WhoIsTheNotificationForEnum

  const injured =
    whoIsTheNotificationFor === WhoIsTheNotificationForEnum.ME
      ? {
          ...(getValueViaPath(answers, 'applicant') as ApplicantV2),
          jobTitle: getValueViaPath(answers, 'workAccident.jobTitle') as string,
        }
      : (getValueViaPath(
          answers,
          'injuredPersonInformation',
        ) as InjuredPersonInformationV2)

  return {
    nationalId: injured.nationalId ?? '',
    name: injured.name ?? '',
    email: injured.email ?? '',
    phone: injured.phoneNumber ?? '',
    occupation: injured.jobTitle ?? '',
  }
}

const getAccident = (
  answers: AccidentNotificationAnswers,
): MinarsidurAPIModelsAccidentReportsAccidentDTO => {
  const accidentType = accidentTypeToDTO(answers)

  const accidentDetails = getValueViaPath(
    answers,
    'accidentDetails',
  ) as AccidentDetailsV2

  const fatal = getValueViaPath(answers, 'wasTheAccidentFatal') as YesOrNo

  const accidentLocation = locationToDTO(answers)

  return {
    type: accidentType.type ?? null,
    subtype: accidentType.subtype ?? null,
    datetime: accidentDetails.dateOfAccident
      ? new Date(accidentDetails.dateOfAccident)
      : new Date(),
    description: accidentDetails.descriptionOfAccident ?? '',
    fatal: fatal === 'yes',
    location: accidentLocation,
    locationDescription: accidentDetails.descriptionOfAccident ?? '',
    symptoms: accidentDetails.accidentSymptoms ?? '',
    dateTimeOfDoctorVisit: accidentDetails.dateOfDoctorVisit
      ? new Date(accidentDetails.dateOfDoctorVisit)
      : new Date(),
    // dockName: null, // Not in the application, but should it?
    // dockGps: null, // Not in the application, but should it?
    atHome: getAtHome(answers),
    atWork: getAtWork(answers),
    atSailorWork: getAtSailorWork(answers),
  }
}

const getAtHome = (answers: AccidentNotificationAnswers) => {
  const homeAccident = getValueViaPath(
    answers,
    'homeAccident',
  ) as HomeAccidentV2

  if (!homeAccident) {
    return undefined
  }

  return (
    homeAccident && {
      address: homeAccident.address ?? '',
      city: homeAccident.community ?? '',
      postcode: homeAccident.postalCode ?? '',
      comment: homeAccident.moreDetails ?? '',
    }
  )
}

const getAtWork = (answers: AccidentNotificationAnswers) => {
  const workMachine = getValueViaPath(answers, 'workMachine') as WorkMachineV2

  if (!workMachine || !workMachine?.descriptionOfMachine) {
    return undefined
  }

  return { machineDescription: workMachine.descriptionOfMachine }
}

const getAtSailorWork = (answers: AccidentNotificationAnswers) => {
  const shipLocation = shipLocationToDTO(answers)
  const fishingShipInfo = getValueViaPath(
    answers,
    'fishingShipInfo',
  ) as FishingShipInfoV2

  if (!shipLocation || !fishingShipInfo) {
    return undefined
  }

  return {
    shipLocation: shipLocation,
    shipName: fishingShipInfo.shipName ?? '',
    shipDesignation: fishingShipInfo.shipCharacters ?? '',
    shipHomePort: fishingShipInfo.homePort ?? '',
    shipRegistryNumber: fishingShipInfo.shipRegisterNumber ?? '',
  }
}

const getEmployer = (
  answers: AccidentNotificationAnswers,
): MinarsidurAPIModelsAccidentReportsEmployerDTO | undefined => {
  const companyInfo = getValueViaPath(answers, 'companyInfo') as CompanyInfoV2
  const accidentType = getValueViaPath(
    answers,
    'accidentType.radioButton',
  ) as AccidentTypeEnum
  const representative = getValueViaPath(
    answers,
    'representative',
  ) as RepresentativeInfoV2

  if (
    answers.juridicalPerson &&
    answers.applicant &&
    utils.isRepresentativeOfCompanyOrInstitute(answers)
  ) {
    return {
      companyName: answers.juridicalPerson.companyNationalId,
      companyNationalId: answers.juridicalPerson.companyName,
      representativeName: answers.applicant.name ?? '',
      representativeEmail: answers.applicant.email ?? '',
      representativePhone: answers.applicant.phoneNumber ?? '',
    }
  }

  if (
    accidentType === AccidentTypeEnum.HOMEACTIVITIES ||
    !companyInfo ||
    !representative
  ) {
    return undefined
  }

  return {
    companyName: companyInfo.name ?? '',
    companyNationalId: companyInfo.nationalRegistrationId ?? '',
    representativeName: representative.name ?? '',
    representativeEmail: representative.email ?? '',
    representativePhone: representative.phoneNumber ?? '',
  }
}

const getClub = (
  answers: AccidentNotificationAnswers,
): MinarsidurAPIModelsAccidentReportsClubDTO | undefined => {
  const accidentType = getValueViaPath(
    answers,
    'accidentType.radioButton',
  ) as AccidentTypeEnum
  if (accidentType !== AccidentTypeEnum.SPORTS) return

  const club = getValueViaPath(answers, 'companyInfo') as CompanyInfoV2
  const accidentLocation = getValueViaPath(
    answers,
    'accidentLocation.answer',
  ) as string
  return {
    nationalId: club.nationalRegistrationId ?? '',
    name: club.name ?? '',
    accidentType: accidentLocation ?? '',
  }
}

const getAttachments = (
  attachments: Array<AccidentNotificationAttachment>,
): Array<MinarsidurAPIModelsAccidentReportsAccidentReportAttachmentDTO> => {
  const mappedFiles = attachments.map((attachment) => {
    const contentType = attachment.name.split('.').pop()
    return {
      type: attachment.attachmentType === 4 ? 2 : attachment.attachmentType, // Hack since additional files are not supported yet...
      document: {
        fileName: attachment.name,
        contentType: contentType ?? undefined,
        data: attachment.content,
      },
    }
  })

  return mappedFiles
}

export const mapAttachmentTypeToAccidentReportType = (
  attachmentType: AttachmentTypeEnum,
): MinarsidurAPIModelsAccidentReportsAccidentReportAttachmentTypeEnum => {
  switch (attachmentType) {
    case AttachmentTypeEnum.INJURY_CERTIFICATE:
      return MinarsidurAPIModelsAccidentReportsAccidentReportAttachmentTypeEnum.NUMBER_1
    case AttachmentTypeEnum.POWER_OF_ATTORNEY:
      return MinarsidurAPIModelsAccidentReportsAccidentReportAttachmentTypeEnum.NUMBER_2
    case AttachmentTypeEnum.POLICE_REPORT:
      return MinarsidurAPIModelsAccidentReportsAccidentReportAttachmentTypeEnum.NUMBER_3
    case AttachmentTypeEnum.ADDITIONAL_FILES:
      return MinarsidurAPIModelsAccidentReportsAccidentReportAttachmentTypeEnum.NUMBER_4
    default:
      throw new Error('Unknown attachment type')
  }
}
