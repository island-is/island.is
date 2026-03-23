import {
  AccidentNotificationAttachment,
  AttachmentTypeEnum,
} from './types/attachments'
import { getValueViaPath, YesOrNo } from '@island.is/application/core'
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
} from '@island.is/application/templates/iceland-health/accident-notification'
import {
  MinarsidurAPIModelsAccidentReportsAccidentReportDTO,
  MinarsidurAPIModelsAccidentReportsReporterDTO,
  MinarsidurAPIModelsAccidentReportsInjuredDTO,
  MinarsidurAPIModelsAccidentReportsAccidentDTO,
  MinarsidurAPIModelsAccidentReportsEmployerDTO,
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
    attachments: getAttachments(attachments),
  }
}

const reportingForMap = {
  [WhoIsTheNotificationForEnum.ME]:
    MinarsidurAPIModelsAccidentReportsReporterDTOReportingForEnum.NUMBER_1,
  [WhoIsTheNotificationForEnum.POWEROFATTORNEY]:
    MinarsidurAPIModelsAccidentReportsReporterDTOReportingForEnum.NUMBER_2,
  [WhoIsTheNotificationForEnum.JURIDICALPERSON]:
    MinarsidurAPIModelsAccidentReportsReporterDTOReportingForEnum.NUMBER_3,
  [WhoIsTheNotificationForEnum.CHILDINCUSTODY]:
    MinarsidurAPIModelsAccidentReportsReporterDTOReportingForEnum.NUMBER_4,
}

const whoIsTheNotificationForToDTO = (who?: WhoIsTheNotificationForEnum) => {
  if (!who) {
    return MinarsidurAPIModelsAccidentReportsReporterDTOReportingForEnum.NUMBER_1
  }
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
  const accidentType = getValueViaPath<AccidentTypeEnum>(
    answers,
    'accidentType.radioButton',
  )
  const workAccidentType = getValueViaPath<WorkAccidentTypeEnum>(
    answers,
    'workAccident.type',
  )
  const studiesAccidentType = getValueViaPath<StudiesAccidentTypeEnum>(
    answers,
    'studiesAccident.type',
  )

  return { accidentType, workAccidentType, studiesAccidentType }
}

const accidentTypeToDTO = (
  answers: AccidentNotificationAnswers,
): { type: number; subtype?: number } => {
  const { accidentType, workAccidentType, studiesAccidentType } =
    getAccidentTypes(answers)

  const baseType = accidentType ? accidentTypeMap[accidentType] : { type: 6 }

  switch (accidentType) {
    case AccidentTypeEnum.WORK:
      return {
        type: baseType.type,
        subtype: workAccidentType
          ? workAccidentSubtypeMap[workAccidentType]
          : 1,
      }
    case AccidentTypeEnum.STUDIES:
      return {
        type: baseType.type,
        subtype: studiesAccidentType
          ? studiesAccidentSubtypeMap[studiesAccidentType]
          : undefined,
      }
    default:
      return baseType
  }
}

const locationToDTO = (answers: AccidentNotificationAnswers) => {
  const accidentLocation =
    getValueViaPath<GeneralWorkplaceAccidentLocationEnum>(
      answers,
      'accidentLocation.answer',
    )

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
  const accidentLocation =
    getValueViaPath<FishermanWorkplaceAccidentLocationEnum>(
      answers,
      'accidentLocation.answer',
    )

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
  const applicant = getValueViaPath<ApplicantV2>(answers, 'applicant')
  const whoIsTheNotificationFor = getValueViaPath<WhoIsTheNotificationForEnum>(
    answers,
    'whoIsTheNotificationFor.answer',
  )

  const reportingFor = whoIsTheNotificationForToDTO(whoIsTheNotificationFor)

  const reporter = {
    address: applicant?.address ?? '',
    city: applicant?.city ?? '',
    email: applicant?.email ?? '',
    name: applicant?.name ?? '',
    nationalId: applicant?.nationalId ?? '',
    phoneNumber: applicant?.phoneNumber ?? '',
    postcode: applicant?.postalCode ?? '',
    reportingFor,
  }

  return reporter
}

const getInjured = (
  answers: AccidentNotificationAnswers,
): MinarsidurAPIModelsAccidentReportsInjuredDTO => {
  const whoIsTheNotificationFor = getValueViaPath<WhoIsTheNotificationForEnum>(
    answers,
    'whoIsTheNotificationFor.answer',
  )

  const injured =
    whoIsTheNotificationFor === WhoIsTheNotificationForEnum.ME
      ? {
          ...getValueViaPath<ApplicantV2>(answers, 'applicant'),
          jobTitle: getValueViaPath<string>(answers, 'workAccident.jobTitle'),
        }
      : getValueViaPath<InjuredPersonInformationV2>(
          answers,
          'injuredPersonInformation',
        )

  return {
    nationalId: injured?.nationalId ?? '',
    name: injured?.name ?? '',
    email: injured?.email ?? '',
    phone: injured?.phoneNumber ?? '',
    occupation: injured?.jobTitle ?? '',
  }
}

const createDateTime = (date?: string | null, time?: string | null): Date => {
  if (!date) {
    return new Date()
  }

  const [year, month, day] = date.split('-').map(Number)
  let hours = time ? parseInt(time.slice(0, 2), 10) : 0
  let minutes = time ? parseInt(time.slice(2, 4), 10) : 0

  if (hours > 23 || hours < 0) {
    hours = 0
  }

  if (minutes > 59 || minutes < 0) {
    minutes = 0
  }

  return new Date(year, month - 1, day, hours, minutes)
}

const createNullableDateTime = (
  date?: string | null,
  time?: string | null,
): Date | null => {
  if (!date) {
    return null
  }

  const [year, month, day] = date.split('-').map(Number)
  let hours = time ? parseInt(time.slice(0, 2), 10) : 0
  let minutes = time ? parseInt(time.slice(2, 4), 10) : 0

  if (hours > 23 || hours < 0) {
    hours = 0
  }

  if (minutes > 59 || minutes < 0) {
    minutes = 0
  }

  return new Date(year, month - 1, day, hours, minutes)
}

const getAccident = (
  answers: AccidentNotificationAnswers,
): MinarsidurAPIModelsAccidentReportsAccidentDTO => {
  const accidentType = accidentTypeToDTO(answers)

  const accidentDetails = getValueViaPath<AccidentDetailsV2>(
    answers,
    'accidentDetails',
  )

  const fatal = getValueViaPath<YesOrNo>(answers, 'wasTheAccidentFatal')

  const accidentLocation = locationToDTO(answers)

  const locationDescription = getValueViaPath<string>(
    answers,
    'locationAndPurpose.location',
  )

  return {
    type: accidentType.type ?? null,
    subtype: accidentType.subtype ?? null,
    datetime: createDateTime(
      accidentDetails?.dateOfAccident,
      accidentDetails?.timeOfAccident,
    ),
    description: accidentDetails?.descriptionOfAccident ?? '',
    fatal: fatal === 'yes',
    location: accidentLocation,
    locationDescription: locationDescription ?? '',
    symptoms: accidentDetails?.accidentSymptoms ?? '',
    dateTimeOfDoctorVisit: createNullableDateTime(
      accidentDetails?.dateOfDoctorVisit,
      accidentDetails?.timeOfDoctorVisit,
    ),
    // dockName: null, // Not in the application, but should it?
    // dockGps: null, // Not in the application, but should it?
    atHome: getAtHome(answers),
    atWork: getAtWork(answers),
    atSailorWork: getAtSailorWork(answers),
  }
}

const getAtHome = (answers: AccidentNotificationAnswers) => {
  const homeAccident = getValueViaPath<HomeAccidentV2>(answers, 'homeAccident')

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
  const workMachine = getValueViaPath<WorkMachineV2>(answers, 'workMachine')

  if (!workMachine || !workMachine?.descriptionOfMachine) {
    return undefined
  }

  return { machineDescription: workMachine.descriptionOfMachine }
}

const getAtSailorWork = (answers: AccidentNotificationAnswers) => {
  const shipLocation = shipLocationToDTO(answers)
  const fishingShipInfo = getValueViaPath<FishingShipInfoV2>(
    answers,
    'fishingShipInfo',
  )

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
  const companyInfo = getValueViaPath<CompanyInfoV2>(answers, 'companyInfo')
  const accidentType = getValueViaPath<AccidentTypeEnum>(
    answers,
    'accidentType.radioButton',
  )
  const representative = getValueViaPath<RepresentativeInfoV2>(
    answers,
    'representative',
  )

  if (
    answers.juridicalPerson &&
    answers.applicant &&
    utils.isRepresentativeOfCompanyOrInstitute(answers)
  ) {
    const { companyName, companyNationalId } = answers.juridicalPerson
    const { name, email, phoneNumber } = answers.applicant
    return {
      companyName,
      companyNationalId,
      representativeName: name ?? '',
      representativeEmail: email ?? '',
      representativePhone: phoneNumber ?? '',
    }
  }

  if (
    accidentType === AccidentTypeEnum.HOMEACTIVITIES ||
    !companyInfo ||
    !representative
  ) {
    return undefined
  }

  const {
    name: companyName = '',
    nationalRegistrationId: companyNationalId = '',
  } = companyInfo
  const { name, email, phoneNumber } = representative

  return {
    companyName,
    companyNationalId,
    representativeName: name ?? '',
    representativeEmail: email ?? '',
    representativePhone: phoneNumber ?? '',
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
