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
import { Communication } from '../models/communication.model'
import { HealthDirectorateCommunicationDetail } from '../models/communicationDetail.model'
import { CommunicationStaffRef } from '../models/communicationStaffRef.model'
import {
  CommunicationKindEnum,
  PregnancyDocumentKindEnum,
} from '../models/enums'
import { ExaminationCommunicationDetail } from '../models/examinationCommunicationDetail.model'
import { ExaminationMeasurement } from '../models/examinationMeasurement.model'
import { FetalHeartRate } from '../models/fetalHeartRate.model'
import { PhoneCallCommunicationDetail } from '../models/phoneCallCommunicationDetail.model'
import { PregnancyDocument } from '../models/pregnancyDocument.model'
import { PregnancyStaff } from '../models/pregnancyStaff.model'

const mapCommunicationKind = (kind: CommunicationKind): CommunicationKindEnum =>
  kind === CommunicationKind.PHONE_CALL
    ? CommunicationKindEnum.PHONE_CALL
    : CommunicationKindEnum.EXAMINATION

const mapDocumentKind = (kind: DocumentKind): PregnancyDocumentKindEnum =>
  kind === DocumentKind.ATTACHMENT
    ? PregnancyDocumentKindEnum.ATTACHMENT
    : PregnancyDocumentKindEnum.CERTIFICATE

export const mapPregnancyStaff = (
  dto: PregnancyStaffDto,
): PregnancyStaff | undefined => {
  if (!dto.name) {
    return undefined
  }

  return {
    name: dto.name,
    employeeType: dto.employeeType ?? undefined,
    profession: dto.profession ?? undefined,
    organizationName: dto.organizationName ?? undefined,
    divisionName: dto.divisionName ?? undefined,
  }
}

export const mapCommunicationStaffRef = (
  dto: CommunicationStaffRefDto | undefined,
): CommunicationStaffRef | undefined => {
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
  if (!dto.identifier) {
    return undefined
  }

  return {
    identifier: dto.identifier,
    soundLower: dto.soundLower ?? undefined,
    soundUpper: dto.soundUpper ?? undefined,
    position: dto.position ?? undefined,
  }
}

export const mapActivePregnancy = (
  dto: ActivePregnancyDto,
): ActivePregnancy => {
  if (!dto.id) {
    throw new Error('ActivePregnancyDto missing required id field')
  }

  return {
    id: dto.id,
    startDate: dto.startDate ?? undefined,
    dueDate: dto.dueDate ?? undefined,
    lengthWeeks: dto.lengthWeeks ?? undefined,
    lengthDays: dto.lengthDays ?? undefined,
    numberOfEmbryos: dto.numberOfEmbryos ?? undefined,
    motherName: dto.motherName ?? undefined,
    partnerName: dto.partnerName ?? undefined,
    staff: (dto.staff ?? []).map(mapPregnancyStaff).filter(isDefined),
    endedWithBirth: dto.endedWithBirth ?? undefined,
    lastUpdated: dto.lastUpdated ?? undefined,
  }
}

export const mapCommunication = (dto: CommunicationDto): Communication => ({
  id: dto.id,
  kind: mapCommunicationKind(dto.kind),
  weeks: dto.weeks ?? undefined,
  days: dto.days ?? undefined,
  dateTime: dto.dateTime ?? undefined,
  text: dto.text ?? undefined,
  authorName: dto.authorName ?? undefined,
  subjectTerm: dto.subject?.term ?? undefined,
  lastUpdated: dto.lastUpdated ?? undefined,
})

const mapExaminationCommunicationDetail = (
  dto: ExaminationCommunicationDetailDto,
): ExaminationCommunicationDetail => ({
  id: dto.id,
  kind: CommunicationKindEnum.EXAMINATION,
  weeks: dto.weeks ?? undefined,
  days: dto.days ?? undefined,
  dateTime: dto.dateTime ?? undefined,
  text: dto.text ?? undefined,
  authorName: dto.authorName ?? undefined,
  subjectTerm: dto.subject?.term ?? undefined,
  lastUpdated: dto.lastUpdated ?? undefined,
  registeredBy: mapCommunicationStaffRef(dto.registeredBy),
  weight: dto.weight ?? undefined,
  pulse: dto.pulse ?? undefined,
  bloodPressureUpper: dto.bloodPressureUpper ?? undefined,
  bloodPressureLower: dto.bloodPressureLower ?? undefined,
  hemoglobinScore: dto.hemoglobinScore ?? undefined,
  albumenInUrineScore: dto.albumenInUrineScore ?? undefined,
  cervixHeight: dto.cervixHeight ?? undefined,
  fetalHeartRates: (dto.fetalHeartRates ?? [])
    .map(mapFetalHeartRate)
    .filter(isDefined),
})

const mapPhoneCallCommunicationDetail = (
  dto: PhoneCallCommunicationDetailDto,
): PhoneCallCommunicationDetail => ({
  id: dto.id,
  kind: CommunicationKindEnum.PHONE_CALL,
  weeks: dto.weeks ?? undefined,
  days: dto.days ?? undefined,
  dateTime: dto.dateTime ?? undefined,
  text: dto.text ?? undefined,
  authorName: dto.authorName ?? undefined,
  subjectTerm: dto.subject?.term ?? undefined,
  lastUpdated: dto.lastUpdated ?? undefined,
  registeredBy: mapCommunicationStaffRef(dto.registeredBy),
  phoneCallReason: dto.phoneCallReason ?? undefined,
  phoneCallResult: dto.phoneCallResult ?? undefined,
  checklist: dto.checklist ?? undefined,
})

export const mapCommunicationDetail = (
  dto: PregnancyCommunicationDetailDto,
): typeof HealthDirectorateCommunicationDetail =>
  dto.kind === 'PHONE_CALL'
    ? mapPhoneCallCommunicationDetail(dto)
    : mapExaminationCommunicationDetail(dto)

export const mapExaminationMeasurement = (
  dto: ExaminationMeasurementDto,
): ExaminationMeasurement => {
  if (!dto.examinationId) {
    throw new Error('ExaminationMeasurementDto missing required examinationId field')
  }

  return {
    id: dto.examinationId,
    examinationDate: dto.examinationDate ?? undefined,
    weeks: dto.weeks ?? undefined,
    days: dto.days ?? undefined,
    weight: dto.weight ?? undefined,
    pulse: dto.pulse ?? undefined,
    bloodPressureUpper: dto.bloodPressureUpper ?? undefined,
    bloodPressureLower: dto.bloodPressureLower ?? undefined,
    hemoglobinScore: dto.hemoglobinScore ?? undefined,
    albumenInUrineScore: dto.albumenInUrineScore ?? undefined,
    cervixHeight: dto.cervixHeight ?? undefined,
    fetalHeartRates: (dto.fetalHeartRates ?? [])
      .map(mapFetalHeartRate)
      .filter(isDefined),
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
