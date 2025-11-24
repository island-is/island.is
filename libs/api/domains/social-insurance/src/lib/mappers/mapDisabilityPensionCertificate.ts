import {
  TrWebExternalModelsServicePortalDisabilityPensionCertificate,
  TrWebExternalModelsServicePortalDoctorInfo,
  TrWebExternalModelsServicePortalDisabilityDiagnosis,
  TrWebExternalModelsServicePortalHealthImpact,
  TrWebExternalModelsServicePortalAbilityRating,
  TrWebExternalModelsServicePortalImpairment,
  TrWebExternalModelsServicePortalEnvironmentalFactor,
  TrWebExternalModelsServicePortalFunction,
  TrWebExternalModelsServicePortalEnvironmentalCategory,
  TrWebExternalModelsServicePortalImpairmentType,
} from '@island.is/clients/social-insurance-administration'
import { Doctor } from '../models/medicalDocuments/doctor.model'
import { DisabilityDiagnosisCollection } from '../models/medicalDocuments/disabilityDiagnosisCollection.model'
import { DisabilityDiagnosis } from '../models/medicalDocuments/disabilityDiagnosis.model'
import { HealthImpact } from '../models/medicalDocuments/healthImpact.model'
import { AbilityRating } from '../models/medicalDocuments/abilityRating.model'
import { Impairment } from '../models/medicalDocuments/impairment.model'
import { EnvironmentalFactor } from '../models/medicalDocuments/environmentalFactor.model'
import { MedicalDocumentFunction } from '../models/medicalDocuments/function.model'
import { EnvironmentalCategory } from '../enums/environmentalCategory'
import { ImpairmentType } from '../enums/impairmentType'
import { DisabilityPensionCertificate } from '../models/medicalDocuments/disabilityPensionCertificate.model'

const mapDoctor = (
  doctorInfo?: TrWebExternalModelsServicePortalDoctorInfo,
): Doctor | undefined => {
  if (!doctorInfo) return undefined

  return {
    name: doctorInfo.name ?? undefined,
    doctorNumber: doctorInfo.doctorNumber ?? undefined,
    residence: doctorInfo.residence ?? undefined,
    phoneNumber: doctorInfo.phoneNumber ?? undefined,
    email: doctorInfo.email ?? undefined,
  }
}

const mapDisabilityDiagnosis = (
  diagnosis?: TrWebExternalModelsServicePortalDisabilityDiagnosis,
): DisabilityDiagnosis | undefined => {
  if (!diagnosis || !diagnosis.code) return undefined

  return {
    code: diagnosis.code,
    description: diagnosis.description ?? undefined,
  }
}

const mapDisabilityDiagnosisCollection = (
  diagnosis?: Array<TrWebExternalModelsServicePortalDisabilityDiagnosis> | null,
  diagnosesOthers?: Array<TrWebExternalModelsServicePortalDisabilityDiagnosis> | null,
): DisabilityDiagnosisCollection | undefined => {
  if (!diagnosis && !diagnosesOthers) return undefined

  return {
    mainDiagnoses: diagnosis?.map(mapDisabilityDiagnosis).filter(Boolean) as
      | DisabilityDiagnosis[]
      | undefined,
    otherDiagnoses: diagnosesOthers
      ?.map(mapDisabilityDiagnosis)
      .filter(Boolean) as DisabilityDiagnosis[] | undefined,
  }
}

const mapHealthImpact = (
  healthImpact?: TrWebExternalModelsServicePortalHealthImpact,
): HealthImpact | undefined => {
  if (!healthImpact) return undefined

  return {
    description: healthImpact.description ?? undefined,
    impactLevel: healthImpact.impactLevel ?? undefined,
  }
}

const mapAbilityRating = (
  rating?: TrWebExternalModelsServicePortalAbilityRating,
): AbilityRating | undefined => {
  if (!rating) return undefined

  return {
    type: rating.type ?? undefined,
    score: rating.score ?? undefined,
  }
}

const mapFunction = (
  func?: TrWebExternalModelsServicePortalFunction,
): MedicalDocumentFunction | undefined => {
  if (!func) return undefined

  return {
    title: func.title ?? undefined,
    keyNumber: func.keyNumber ?? undefined,
    description: func.description ?? undefined,
  }
}

const mapImpairmentType = (
  type?: TrWebExternalModelsServicePortalImpairmentType,
): ImpairmentType | undefined => {
  if (type === undefined || type === null) return undefined

  switch (type) {
    case 0:
      return ImpairmentType.TYPE_0
    case 1:
      return ImpairmentType.TYPE_1
    default:
      return undefined
  }
}

const mapImpairment = (
  impairment?: TrWebExternalModelsServicePortalImpairment,
): Impairment | undefined => {
  if (!impairment) return undefined

  return {
    type: mapImpairmentType(impairment.type),
    functions: impairment.functions?.map(mapFunction).filter(Boolean) as
      | MedicalDocumentFunction[]
      | undefined,
  }
}

const mapEnvironmentalCategory = (
  category?: TrWebExternalModelsServicePortalEnvironmentalCategory,
): EnvironmentalCategory | undefined => {
  if (category === undefined || category === null) return undefined

  switch (category) {
    case 0:
      return EnvironmentalCategory.CATEGORY_0
    case 1:
      return EnvironmentalCategory.CATEGORY_1
    case 2:
      return EnvironmentalCategory.CATEGORY_2
    case 3:
      return EnvironmentalCategory.CATEGORY_3
    case 4:
      return EnvironmentalCategory.CATEGORY_4
    case 5:
      return EnvironmentalCategory.CATEGORY_5
    default:
      return undefined
  }
}

const mapEnvironmentalFactor = (
  factor?: TrWebExternalModelsServicePortalEnvironmentalFactor,
): EnvironmentalFactor | undefined => {
  if (!factor) return undefined

  return {
    category: mapEnvironmentalCategory(factor.category),
    keyNumber: factor.keyNumber ?? undefined,
    description: factor.description ?? undefined,
  }
}

export const mapDisabilityPensionCertificate = (
  data: TrWebExternalModelsServicePortalDisabilityPensionCertificate,
): DisabilityPensionCertificate | null => {
  if (!data || !data.referenceId) {
    return null
  }

  return {
    referenceId: data.referenceId,
    doctor: mapDoctor(data.doctorInfo),
    lastInspectionDate: data.lastInspectionDate
      ? data.lastInspectionDate.toISOString()
      : undefined,
    certificateDate: data.certificateDate
      ? data.certificateDate.toISOString()
      : undefined,
    dateOfWorkIncapacity: data.dateOfWorkIncapacityStart
      ? data.dateOfWorkIncapacityStart.toISOString()
      : undefined,
    diagnoses: mapDisabilityDiagnosisCollection(
      data.diagnosis,
      data.diagnosesOthers,
    ),
    healthHistorySummary: data.healthHistorySummary ?? undefined,
    healthImpact: mapHealthImpact(data.healthImpact),
    participationLimitationCause:
      data.participationLimitationCause ?? undefined,
    abilityChangePotential: data.abilityChangePotential ?? undefined,
    medicationAndSupports: data.medicationAndSupports ?? undefined,
    assessmentToolsUsed: data.assessmentToolsUsed ?? undefined,
    physicalAbilityRatings: data.physicalAbilityRatings
      ?.map(mapAbilityRating)
      .filter(Boolean) as AbilityRating[] | undefined,
    cognitiveAndMentalAbilityRatings: data.cognitiveAndMentalAbilityRatings
      ?.map(mapAbilityRating)
      .filter(Boolean) as AbilityRating[] | undefined,
    functionalAssessment: data.functionalAssessment
      ?.map(mapAbilityRating)
      .filter(Boolean) as AbilityRating[] | undefined,
    impairments: data.impairments?.map(mapImpairment).filter(Boolean) as
      | Impairment[]
      | undefined,
    environmentalFactors: data.environmentalFactors
      ?.map(mapEnvironmentalFactor)
      .filter(Boolean) as EnvironmentalFactor[] | undefined,
  }
}
