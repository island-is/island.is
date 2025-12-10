import { NO, YES } from '@island.is/application/core'
import {
  INCOME,
  ISK,
  RatioType,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { ExternalData, FormValue } from '@island.is/application/types'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from './medicalAndRehabilitationPaymentsUtils'
import {
  MedicalAndRehabilitationPaymentsApplicationType,
  MedicalAndRehabilitationPaymentsConfirmationType,
} from './constants'

export const shouldShowEmployeeSickPayEndDate = (
  answers: FormValue,
): boolean => {
  const { hasUtilizedEmployeeSickPayRights } = getApplicationAnswers(answers)

  return (
    hasUtilizedEmployeeSickPayRights === YES ||
    hasUtilizedEmployeeSickPayRights === NO
  )
}

export const shouldShowIncomePlanMonths = (
  activeField?: Record<string, string>,
): boolean => {
  return (
    activeField?.income === RatioType.MONTHLY &&
    activeField?.incomeCategory === INCOME &&
    activeField?.unevenIncomePerYear?.[0] === YES
  )
}

export const shouldShowEqualIncomePerMonth = (
  isForeign: boolean,
  activeField?: Record<string, string>,
): boolean => {
  const unevenAndEmploymentIncome =
    activeField?.unevenIncomePerYear?.[0] !== YES ||
    (activeField?.incomeCategory !== INCOME &&
      activeField?.unevenIncomePerYear?.[0] === YES)

  const isCurrencyValid = isForeign
    ? activeField?.currency !== ISK
    : activeField?.currency === ISK

  return (
    activeField?.income === RatioType.MONTHLY &&
    isCurrencyValid &&
    unevenAndEmploymentIncome
  )
}

export const shouldShowSpouseFields = (externalData: ExternalData): boolean => {
  const { hasSpouse } = getApplicationExternalData(externalData)
  return !!hasSpouse
}

export const shouldShowCalculatedRemunerationDate = (
  answers: FormValue,
): boolean => {
  const { isSelfEmployed } = getApplicationAnswers(answers)
  return isSelfEmployed === YES
}

export const shouldShowIsStudyingFields = (answers: FormValue): boolean => {
  const { isStudying } = getApplicationAnswers(answers)
  return isStudying === YES
}

export const shouldShowUnionSickPayUnionAndEndDate = (
  answers: FormValue,
): boolean => {
  const { hasUtilizedUnionSickPayRights } = getApplicationAnswers(answers)
  return (
    hasUtilizedUnionSickPayRights === YES ||
    hasUtilizedUnionSickPayRights === NO
  )
}

export const shouldShowPreviousRehabilitationOrTreatmentFields = (
  answers: FormValue,
): boolean => {
  const { hasPreviouslyReceivedRehabilitationOrTreatment } =
    getApplicationAnswers(answers)
  return hasPreviouslyReceivedRehabilitationOrTreatment === YES
}

export const isFirstApplication = (externalData: ExternalData) => {
  const { marpApplicationType } = getApplicationExternalData(externalData)

  return (
    marpApplicationType ===
      MedicalAndRehabilitationPaymentsApplicationType.EH1 ||
    marpApplicationType === MedicalAndRehabilitationPaymentsApplicationType.SG1
  )
}

export const shouldShowRehabilitationPlan = (externalData: ExternalData) => {
  const { marpApplicationType, marpConfirmationType } =
    getApplicationExternalData(externalData)

  return (
    (marpApplicationType ===
      MedicalAndRehabilitationPaymentsApplicationType.EH1 ||
      marpApplicationType ===
        MedicalAndRehabilitationPaymentsApplicationType.EH2) &&
    marpConfirmationType ===
      MedicalAndRehabilitationPaymentsConfirmationType.ENDURHAEFING
  )
}

export const shouldShowConfirmedTreatment = (externalData: ExternalData) => {
  const { marpApplicationType, marpConfirmationType } =
    getApplicationExternalData(externalData)

  return (
    (marpApplicationType ===
      MedicalAndRehabilitationPaymentsApplicationType.SG1 ||
      marpApplicationType ===
        MedicalAndRehabilitationPaymentsApplicationType.SG2) &&
    marpConfirmationType ===
      MedicalAndRehabilitationPaymentsConfirmationType.VIDURKENND_MEDFERD
  )
}

export const shouldShowConfirmationOfPendingResolution = (
  externalData: ExternalData,
) => {
  const { marpApplicationType, marpConfirmationType } =
    getApplicationExternalData(externalData)

  return (
    (marpApplicationType ===
      MedicalAndRehabilitationPaymentsApplicationType.SG1 ||
      marpApplicationType ===
        MedicalAndRehabilitationPaymentsApplicationType.SG2) &&
    marpConfirmationType ===
      MedicalAndRehabilitationPaymentsConfirmationType.BID_EFTIR_URRAEDI
  )
}

export const shouldShowConfirmationOfIllHealth = (
  externalData: ExternalData,
) => {
  const { marpApplicationType, marpConfirmationType } =
    getApplicationExternalData(externalData)

  return (
    (marpApplicationType ===
      MedicalAndRehabilitationPaymentsApplicationType.SG1 ||
      marpApplicationType ===
        MedicalAndRehabilitationPaymentsApplicationType.SG2) &&
    marpConfirmationType ===
      MedicalAndRehabilitationPaymentsConfirmationType.HEILSUBRESTUR
  )
}
