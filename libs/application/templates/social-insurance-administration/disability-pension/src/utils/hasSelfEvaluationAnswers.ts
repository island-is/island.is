import { Application } from '@island.is/application/types'
import { getApplicationAnswers } from './getApplicationAnswers'

type SelfEvaluationAnswers = {
  hasAssistance: boolean
  maritalStatus: boolean
  residence: boolean
  children: boolean
  icelandicCapability: boolean
  language: boolean
  employment: boolean
  employmentOther: boolean
  previousEmployment: boolean
  previousEmploymentWhen: boolean
  previousEmploymentProfession: boolean
  previousEmploymentProfessionActivity: boolean
  educationLevel: boolean
  employmentCapability: boolean
  employmentImportance: boolean
  rehabilitationOrTherapy: boolean
  rehabilitationOrTherapyResults: boolean
  rehabilitationOrTherapyDescription: boolean
  biggestIssue: boolean
}

export const hasSelfEvaluationAnswers = (
  answers: Application['answers'],
): boolean => {
  const {
    hadAssistanceForSelfEvaluation,
    biggestIssue,
    children,
    educationLevel,
    employmentCapability,
    employmentImportance,
    employmentStatus,
    employmentStatusOther,
    icelandicCapability,
    language,
    maritalStatus,
    previousEmployment,
    hasHadRehabilitationOrTherapy,
    rehabilitationOrTherapyResults,
    rehabilitationOrTherapyDescription,
    residence,
  } = getApplicationAnswers(answers)

  const selfEvaluationsAnswers: SelfEvaluationAnswers = {
    hasAssistance: hadAssistanceForSelfEvaluation !== undefined,
    maritalStatus: maritalStatus !== undefined,
    residence: residence !== undefined,
    children: children !== undefined,
    icelandicCapability: icelandicCapability !== undefined,
    language: language !== undefined,
    employment: employmentStatus !== undefined && employmentStatus.length > 0,
    employmentOther: employmentStatusOther !== undefined,
    previousEmployment:
      previousEmployment !== undefined &&
      previousEmployment.hasEmployment !== undefined,
    previousEmploymentWhen:
      previousEmployment !== undefined && previousEmployment.when !== undefined,
    previousEmploymentProfession:
      previousEmployment !== undefined && previousEmployment.job !== undefined,
    previousEmploymentProfessionActivity:
      previousEmployment !== undefined &&
      previousEmployment.field !== undefined,
    educationLevel: educationLevel !== undefined,
    employmentCapability: employmentCapability !== undefined,
    employmentImportance: employmentImportance !== undefined,
    rehabilitationOrTherapy: hasHadRehabilitationOrTherapy !== undefined,
    rehabilitationOrTherapyResults:
      rehabilitationOrTherapyResults !== undefined,
    rehabilitationOrTherapyDescription:
      rehabilitationOrTherapyDescription !== undefined,
    biggestIssue: biggestIssue !== undefined,
  }

  return Object.values(selfEvaluationsAnswers).some((value) => value)
}
