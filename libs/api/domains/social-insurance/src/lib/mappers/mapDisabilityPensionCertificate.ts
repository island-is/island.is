import { Doctor } from '../models/medicalDocuments/doctor.model'
import { DisabilityDiagnosisCollection } from '../models/medicalDocuments/disabilityDiagnosisCollection.model'
import { DisabilityDiagnosis } from '../models/medicalDocuments/disabilityDiagnosis.model'
import { DisabilityPensionCertificate } from '../models/medicalDocuments/disabilityPensionCertificate.model'
import {
  TrWebContractsExternalServicePortalDisabilityDiagnosis,
  TrWebContractsExternalServicePortalDisabilityPensionCertificate,
  TrWebContractsExternalServicePortalDoctorInfo,
  TrWebContractsExternalServicePortalHealthImpact,
  TrWebContractsExternalServicePortalQuestionnaireResult,
} from '@island.is/clients/social-insurance-administration'

const mapDoctor = (
  doctorInfo?: TrWebContractsExternalServicePortalDoctorInfo,
): Doctor | undefined => {
  if (!doctorInfo) return undefined

  return {
    name: doctorInfo.name ?? undefined,
    doctorNumber: doctorInfo.doctorNumber ?? undefined,
    residence: doctorInfo.residence ?? undefined,
    phoneNumber: doctorInfo.phoneNumber ?? undefined,
    email: doctorInfo.email ?? undefined,
    jobTitle: 'no data',
  }
}

const mapDisabilityDiagnosis = (
  diagnosis?: TrWebContractsExternalServicePortalDisabilityDiagnosis,
): DisabilityDiagnosis | undefined => {
  if (!diagnosis || !diagnosis.code) return undefined

  return {
    code: diagnosis.code,
    description: diagnosis.description ?? undefined,
  }
}

const mapDisabilityDiagnosisCollection = (
  diagnosis?: Array<TrWebContractsExternalServicePortalDisabilityDiagnosis> | null,
  diagnosesOthers?: Array<TrWebContractsExternalServicePortalDisabilityDiagnosis> | null,
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

export const mapDisabilityPensionCertificate = (
  data: TrWebContractsExternalServicePortalDisabilityPensionCertificate,
): DisabilityPensionCertificate | null => {
  if (!data || !data.referenceId) {
    return null
  }

  return {
    referenceId: data.referenceId,
    createdAt: data.created ?? undefined,
    healthCenter: data.serviceProviderName ?? undefined,
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
    stabilityOfHealth: data.healthImpact?.impactLevel?.display ?? undefined,
    participationLimitationCause:
      data.participationLimitationCause?.display ?? undefined,
    abilityChangePotential: data.abilityChangePotential?.display ?? undefined,
    medicationAndSupports: data.interventionUsed ?? undefined,
    assessmentToolsUsed: data.assessmentToolsUsed ?? undefined,
    capacityForWork: data.capacityForWork ?? undefined,
    previousRehabilitation: data.previousRehabilitation ?? undefined,
    physicalImpairments: undefined, //MISSING
    mentalImpairments: undefined, //MISSING
  }
}
