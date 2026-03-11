import { Doctor } from '../models/medicalDocuments/doctor.model'
import { DisabilityDiagnosisCollection } from '../models/medicalDocuments/disabilityDiagnosisCollection.model'
import { DisabilityDiagnosis } from '../models/medicalDocuments/disabilityDiagnosis.model'
import type {
  TrWebContractsExternalServicePortalDisabilityDiagnosis,
  TrWebContractsExternalServicePortalDisabilityPensionCertificate,
  TrWebContractsExternalServicePortalDoctor,
  TrWebContractsExternalServicePortalHealthImpact,
  TrWebContractsExternalServicePortalQuestionnaireResult,
} from '@island.is/clients/social-insurance-administration'
import type { Locale } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import {
  DISABILITY_CERTIFICATE_MENTAL_QUESTIONNAIRE_CODE,
  DISABILITY_CERTIFICATE_PHYSICAL_QUESTIONNAIRE_CODE,
} from '../constants'
import { ImpairmentRating } from '../models/medicalDocuments/impairmentRating.model'
import { MedicationAndSupportsUsed } from '../models/medicalDocuments/medicationAndSupportsUsed.model'
import { StabilityOfHealth } from '../models/medicalDocuments/stabilityOfHealth.model'
import { DisabilityPensionCertificate } from '../models/medicalDocuments/disabilityPensionCertificate.model'

const mapDoctor = (
  doctorInfo?: TrWebContractsExternalServicePortalDoctor,
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

const mapImpairmentRating = (
  data: TrWebContractsExternalServicePortalQuestionnaireResult,
  locale: Locale,
): ImpairmentRating[] | undefined => {
  const { answers, scale } = data

  if (!answers || !scale) {
    return undefined
  }

  return answers
    .map((answerData) => {
      const answerValue = scale.find(
        (s) => s.value?.toString() === answerData.answer,
      )
      if (
        !answerValue ||
        answerValue.value === undefined ||
        !answerData.questionTitle
      ) {
        return undefined
      }

      return {
        title:
          answerData.questionTitle ??
          (locale === 'en' ? 'Missing title' : 'Titil vantar'),
        value:
          answerValue.display ??
          (locale === 'en' ? 'Missing answer' : 'Svar vantar'),
      }
    })
    .filter(isDefined)
}

const mapMedicationAndSupportsUsed = (
  data: TrWebContractsExternalServicePortalDisabilityPensionCertificate,
): MedicationAndSupportsUsed | undefined => {
  const {
    noMedicationAndSupportUsed,
    medicationUsed,
    assessmentToolsUsed,
    interventionUsed,
  } = data

  if (
    noMedicationAndSupportUsed ||
    (!medicationUsed && !assessmentToolsUsed && !interventionUsed)
  ) {
    return undefined
  }

  return {
    medicationUsed: medicationUsed ?? undefined,
    supportsUsed: assessmentToolsUsed ?? undefined,
    interventionsUsed: interventionUsed ?? undefined,
  }
}

const mapStabilityOfHealth = (
  data: TrWebContractsExternalServicePortalHealthImpact,
): StabilityOfHealth | undefined => {
  const { description, impactLevel } = data

  if (!impactLevel?.display) {
    return undefined
  }

  return {
    description: impactLevel.display,
    furtherDetails: description ?? undefined,
  }
}

export const mapDisabilityPensionCertificate = (
  data: TrWebContractsExternalServicePortalDisabilityPensionCertificate,
  locale: Locale,
): DisabilityPensionCertificate | null => {
  if (!data || !data.referenceId) {
    return null
  }

  const physicalImpairmentQuestionnaireResult = (
    data.questionnaireResults ?? []
  ).find(
    (s) =>
      s.questionnaireCode ===
      DISABILITY_CERTIFICATE_PHYSICAL_QUESTIONNAIRE_CODE,
  )

  const mentalImpairmentQuestionnaireResult = (
    data.questionnaireResults ?? []
  ).find(
    (s) =>
      s.questionnaireCode === DISABILITY_CERTIFICATE_MENTAL_QUESTIONNAIRE_CODE,
  )

  return {
    referenceId: data.referenceId,
    doctor: mapDoctor(data.doctorInfo),
    dateOfWorkIncapacity: data.dateOfWorkIncapacityStart
      ? data.dateOfWorkIncapacityStart.toISOString()
      : undefined,
    diagnoses: mapDisabilityDiagnosisCollection(
      data.diagnosis,
      data.diagnosesOthers,
    ),
    healthHistorySummary: data.healthHistorySummary ?? undefined,
    stabilityOfHealth: data.healthImpact
      ? mapStabilityOfHealth(data.healthImpact)
      : undefined,
    participationLimitationCause:
      data.participationLimitationCause?.display ?? undefined,
    abilityChangePotential: data.abilityChangePotential?.display ?? undefined,
    medicationAndSupportsUsed: mapMedicationAndSupportsUsed(data),
    capacityForWork: data.capacityForWork ?? undefined,
    previousRehabilitation: data.previousRehabilitation ?? undefined,
    physicalImpairments: physicalImpairmentQuestionnaireResult
      ? mapImpairmentRating(physicalImpairmentQuestionnaireResult, locale)
      : undefined,
    mentalImpairments: mentalImpairmentQuestionnaireResult
      ? mapImpairmentRating(mentalImpairmentQuestionnaireResult, locale)
      : undefined,
  }
}
