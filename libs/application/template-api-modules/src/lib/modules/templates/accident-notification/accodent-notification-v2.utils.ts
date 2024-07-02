import { AccidentNotificationAttachment } from './types/attachments'
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
  MinarsidurAPIModelsAccidentReportsReporterDTOReporterReportingFor,
  MinarsidurAPIModelsAccidentReportsAccidentReportAttachmentType,
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

const whoIsTheNotificationForToDTO = (who: WhoIsTheNotificationForEnum) => {
  if (WhoIsTheNotificationForEnum.ME === who) {
    return MinarsidurAPIModelsAccidentReportsReporterDTOReporterReportingFor.NUMBER_1
  }

  if (WhoIsTheNotificationForEnum.JURIDICALPERSON === who) {
    return MinarsidurAPIModelsAccidentReportsReporterDTOReporterReportingFor.NUMBER_2
  }

  if (WhoIsTheNotificationForEnum.POWEROFATTORNEY === who) {
    return MinarsidurAPIModelsAccidentReportsReporterDTOReporterReportingFor.NUMBER_3
  }

  if (WhoIsTheNotificationForEnum.CHILDINCUSTODY === who) {
    return MinarsidurAPIModelsAccidentReportsReporterDTOReporterReportingFor.NUMBER_4
  }

  return MinarsidurAPIModelsAccidentReportsReporterDTOReporterReportingFor.NUMBER_1
}

/*
 * type can be 4: Íþróttaslys, 6: Vinnuslys, 7: Heimilistrygging, 8: Björgunarmenn, 9: Nemendur við iðnnám
 *
 * type 6 can have the subtypes 1. Almenn vinna á landi, 2. Vinna sjómanna, 3. Atvinnumennska í íþróttum, 4. Vinna við landbúnað
 * type 9 can have the subtypes 5. Starfsnám, 6. Verknám við háskóla, 7. Iðnám í löggildum iðngreinum
 */
const accidentTypeToDTO = (
  answers: AccidentNotificationAnswers,
): { type: number; subtype?: number } => {
  const accidentType = getValueViaPath(
    answers,
    'accidentType.answer',
  ) as AccidentTypeEnum

  if (AccidentTypeEnum.SPORTS === accidentType) {
    return { type: 4 }
  }

  if (AccidentTypeEnum.WORK === accidentType) {
    const workAccidentType = getValueViaPath(
      answers,
      'workAccident.type',
    ) as WorkAccidentTypeEnum

    let subtype = 1

    if (WorkAccidentTypeEnum.FISHERMAN === workAccidentType) {
      subtype = 2
    }

    if (WorkAccidentTypeEnum.PROFESSIONALATHLETE === workAccidentType) {
      subtype = 3
    }

    if (WorkAccidentTypeEnum.AGRICULTURE === workAccidentType) {
      subtype = 4
    }

    return { type: 6, subtype }
  }

  if (AccidentTypeEnum.HOMEACTIVITIES === accidentType) {
    return { type: 7 }
  }

  if (AccidentTypeEnum.RESCUEWORK === accidentType) {
    return { type: 8 }
  }

  if (AccidentTypeEnum.STUDIES === accidentType) {
    const studiesAccidentType = getValueViaPath(
      answers,
      'studiesAccident.type',
    ) as StudiesAccidentTypeEnum
    let subtype
    if (StudiesAccidentTypeEnum.INTERNSHIP === studiesAccidentType) {
      subtype = 5
    }

    if (StudiesAccidentTypeEnum.APPRENTICESHIP === studiesAccidentType) {
      subtype = 6
    }

    if (StudiesAccidentTypeEnum.VOCATIONALEDUCATION === studiesAccidentType) {
      subtype = 7
    }

    return { type: 9, subtype }
  }

  return { type: 6 }
}

const locationToDTO = (answers: AccidentNotificationAnswers) => {
  const accidentLocation = getValueViaPath(
    answers,
    'accidentLocation.answer',
  ) as GeneralWorkplaceAccidentLocationEnum

  if (
    GeneralWorkplaceAccidentLocationEnum.ATTHEWORKPLACE === accidentLocation
  ) {
    return 0
  }

  if (
    GeneralWorkplaceAccidentLocationEnum.TOORFROMTHEWORKPLACE ===
    accidentLocation
  ) {
    return 1
  }

  if (GeneralWorkplaceAccidentLocationEnum.OTHER === accidentLocation) {
    return 2
  }
}

const shipLocationToDTO = (answers: AccidentNotificationAnswers) => {
  const accidentLocation = getValueViaPath(
    answers,
    'accidentLocation.answer',
  ) as FishermanWorkplaceAccidentLocationEnum

  if (FishermanWorkplaceAccidentLocationEnum.ONTHESHIP === accidentLocation) {
    return 1
  }

  if (
    FishermanWorkplaceAccidentLocationEnum.TOORFROMTHEWORKPLACE ===
    accidentLocation
  ) {
    return 2
  }

  if (FishermanWorkplaceAccidentLocationEnum.OTHER === accidentLocation) {
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
    type: null ?? accidentType.type,
    subtype: null ?? accidentType.subtype,
    datetime: accidentDetails.dateOfAccident
      ? new Date(accidentDetails.dateOfAccident)
      : new Date(),
    description: accidentDetails.descriptionOfAccident ?? '',
    fatal: fatal === 'yes' ? true : false,
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

  return workMachine && workMachine.descriptionOfMachine
    ? {
        machineDescription: workMachine?.descriptionOfMachine,
      }
    : undefined
}

const getAtSailorWork = (answers: AccidentNotificationAnswers) => {
  const shipLocation = shipLocationToDTO(answers)
  const fishingShipInfo = getValueViaPath(
    answers,
    'fishingShipInfo',
  ) as FishingShipInfoV2

  return (
    shipLocation && {
      shipLocation: shipLocation,
      shipName: fishingShipInfo.shipName ?? '',
      shipDesignation: fishingShipInfo.shipCharacters ?? '',
      shipHomePort: fishingShipInfo.homePort ?? '',
      shipRegistryNumber: fishingShipInfo.shipRegisterNumber ?? '',
    }
  )
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

  if (accidentType !== AccidentTypeEnum.WORK) return

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
