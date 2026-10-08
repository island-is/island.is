import { isDefined } from '@island.is/shared/utils'
import {
  ActivePregnancyDto,
  CommunicationDto,
  CommunicationKind,
  CommunicationStaffRefDto,
  DocumentKind,
  ExaminationCommunicationDetailDto,
  ExaminationMeasurementDto,
  FetalHeartRateDto,
  PhoneCallCommunicationDetailDto,
  PregnancyCommunicationDetailDto,
  PregnancyDocumentDto,
  PregnancyStaffDto,
} from '@island.is/clients/health-directorate'

import { ActivePregnancy } from '../models/activePregnancy.model'
import { PregnancyCommunication } from '../models/pregnancyCommunication.model'
import { PregnancyCommunicationAuthor } from '../models/pregnancyCommunicationAuthor.model'
import {
  ExaminationCommunicationDetail,
  PhoneCallCommunicationDetail,
  PregnancyCommunicationDetail,
} from '../models/pregnancyCommunicationDetail.model'
import {
  PregnancyCommunicationKindEnum,
  PregnancyDocumentKindEnum,
} from '../models/enums'
import { ExaminationMeasurement } from '../models/examinationMeasurement.model'
import { FetalHeartRate } from '../models/fetalHeartRate.model'
import { PregnancyDocument } from '../models/pregnancyDocument.model'
import { PregnancyStaff } from '../models/pregnancyStaff.model'

const mapCommunicationKind = (
  kind: CommunicationKind,
): PregnancyCommunicationKindEnum => {
  switch (kind) {
    case CommunicationKind.EXAMINATION:
      return PregnancyCommunicationKindEnum.examination
    case CommunicationKind.PHONE_CALL:
      return PregnancyCommunicationKindEnum.phoneCall
    default:
      return PregnancyCommunicationKindEnum.unknown
  }
}

const mapDocumentKind = (kind: DocumentKind): PregnancyDocumentKindEnum => {
  switch (kind) {
    case DocumentKind.CERTIFICATE:
      return PregnancyDocumentKindEnum.certificate
    case DocumentKind.ATTACHMENT:
      return PregnancyDocumentKindEnum.attachment
    default:
      return PregnancyDocumentKindEnum.unknown
  }
}

export const mapPregnancyStaff = (
  dto: PregnancyStaffDto,
): PregnancyStaff | undefined => {
  if (!dto.name) {
    return undefined
  }

  return {
    name: dto.name,
    profession: dto.profession ?? undefined,
    organizationName: dto.organizationName ?? undefined,
    divisionName: dto.divisionName ?? undefined,
  }
}

export const mapPregnancyCommunicationAuthor = (
  dto: CommunicationStaffRefDto | undefined,
): PregnancyCommunicationAuthor | undefined => {
  if (!dto?.name) {
    return undefined
  }

  return {
    name: dto.name,
    role: dto.role ?? undefined,
    profession: dto.profession ?? undefined,
    divisionName: dto.divisionName ?? undefined,
    organizationName: dto.organizationName ?? undefined,
  }
}

export const mapFetalHeartRate = (
  dto: FetalHeartRateDto,
): FetalHeartRate | undefined => {
  if (
    !dto.identifier &&
    !isDefined(dto.soundLower) &&
    !isDefined(dto.soundUpper) &&
    !isDefined(dto.position)
  ) {
    return undefined
  }

  return {
    identifier: dto.identifier ?? undefined,
    soundLower: dto.soundLower ?? undefined,
    soundUpper: dto.soundUpper ?? undefined,
    position: dto.position ?? undefined,
  }
}

export const mapActivePregnancy = (
  dto: ActivePregnancyDto,
): ActivePregnancy => ({
  id: dto.id,
  startDate: dto.startDate ?? undefined,
  dueDate: dto.dueDate ?? undefined,
  gestationalWeeks: dto.lengthWeeks ?? undefined,
  gestationalDays: dto.lengthDays ?? undefined,
  numberOfEmbryos: dto.numberOfEmbryos ?? undefined,
  motherName: dto.motherName ?? undefined,
  partnerName: dto.partnerName ?? undefined,
  staff: dto.staff ? dto.staff.map(mapPregnancyStaff).filter(isDefined) : [],
  endedWithBirth: dto.endedWithBirth ?? undefined,
  lastUpdated: dto.lastUpdated ?? undefined,
})

export const mapPregnancyCommunication = (
  dto: CommunicationDto,
): PregnancyCommunication => ({
  id: dto.id,
  kind: mapCommunicationKind(dto.kind),
  weeks: dto.weeks ?? undefined,
  days: dto.days ?? undefined,
  dateTime: dto.dateTime ?? undefined,
  text: dto.text ?? undefined,
  authorName: dto.authorName ?? undefined,
  subject: dto.subject?.term ?? undefined,
  lastUpdated: dto.lastUpdated ?? undefined,
})

const mapExaminationCommunicationDetail = (
  dto: ExaminationCommunicationDetailDto,
): ExaminationCommunicationDetail => ({
  id: dto.id,
  kind: PregnancyCommunicationKindEnum.examination,
  weeks: dto.weeks ?? undefined,
  days: dto.days ?? undefined,
  dateTime: dto.dateTime ?? undefined,
  text: dto.text ?? undefined,
  authorName: dto.authorName ?? undefined,
  subject: dto.subject?.term ?? undefined,
  lastUpdated: dto.lastUpdated ?? undefined,
  registeredBy: mapPregnancyCommunicationAuthor(dto.registeredBy),
  weight: dto.weight ?? undefined,
  pulse: dto.pulse ?? undefined,
  bloodPressureUpper: dto.bloodPressureUpper ?? undefined,
  bloodPressureLower: dto.bloodPressureLower ?? undefined,
  hemoglobin: dto.hemoglobinScore ?? undefined,
  albumenInUrineScore: dto.albumenInUrineScore ?? undefined,
  fundalHeight: dto.cervixHeight ?? undefined,
  fetalHeartRates: dto.fetalHeartRates
    ? dto.fetalHeartRates.map(mapFetalHeartRate).filter(isDefined)
    : [],
})

const mapPhoneCallCommunicationDetail = (
  dto: PhoneCallCommunicationDetailDto,
): PhoneCallCommunicationDetail => ({
  id: dto.id,
  kind: PregnancyCommunicationKindEnum.phoneCall,
  weeks: dto.weeks ?? undefined,
  days: dto.days ?? undefined,
  dateTime: dto.dateTime ?? undefined,
  text: dto.text ?? undefined,
  authorName: dto.authorName ?? undefined,
  subject: dto.subject?.term ?? undefined,
  lastUpdated: dto.lastUpdated ?? undefined,
  registeredBy: mapPregnancyCommunicationAuthor(dto.registeredBy),
})

export const mapPregnancyCommunicationDetail = (
  dto: PregnancyCommunicationDetailDto,
): PregnancyCommunicationDetail => {
  switch (dto.kind) {
    case CommunicationKind.EXAMINATION:
      return mapExaminationCommunicationDetail(dto)
    case CommunicationKind.PHONE_CALL:
      return mapPhoneCallCommunicationDetail(dto)
  }
}

export const mapExaminationMeasurement = (
  dto: ExaminationMeasurementDto,
): ExaminationMeasurement | undefined => {
  if (!dto.examinationId) {
    return undefined
  }

  return {
    id: dto.examinationId,
    date: dto.examinationDate ?? undefined,
    weeks: dto.weeks ?? undefined,
    days: dto.days ?? undefined,
    weight: dto.weight ?? undefined,
    pulse: dto.pulse ?? undefined,
    bloodPressureUpper: dto.bloodPressureUpper ?? undefined,
    bloodPressureLower: dto.bloodPressureLower ?? undefined,
    hemoglobin: dto.hemoglobinScore ?? undefined,
    albumenInUrineScore: dto.albumenInUrineScore ?? undefined,
    fundalHeight: dto.cervixHeight ?? undefined,
    fetalHeartRates: dto.fetalHeartRates
      ? dto.fetalHeartRates.map(mapFetalHeartRate).filter(isDefined)
      : [],
  }
}

export const mapPregnancyDocument = (
  dto: PregnancyDocumentDto,
): PregnancyDocument | undefined => {
  if (!dto.id) {
    return undefined
  }

  return {
    id: dto.id,
    kind: mapDocumentKind(dto.kind),
    title: dto.title ?? undefined,
    date: dto.date ?? undefined,
    organizationName: dto.organizationName ?? undefined,
  }
}
