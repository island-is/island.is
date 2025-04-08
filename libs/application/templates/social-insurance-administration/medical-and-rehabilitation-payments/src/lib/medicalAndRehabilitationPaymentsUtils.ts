import { YesOrNo, getValueViaPath } from '@island.is/application/core'
import { TaxLevelOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { BankInfo, PaymentInfo } from '@island.is/application/templates/social-insurance-administration-core/types'
import { Application } from '@island.is/application/types'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const applicantPhonenumber = getValueViaPath(
    answers,
    'applicantInfo.phonenumber',
  ) as string

  const comment = getValueViaPath(answers, 'comment') as string

  const bank = getValueViaPath(answers, 'paymentInfo.bank') as string

  const personalAllowance = getValueViaPath(
    answers,
    'paymentInfo.personalAllowance',
  ) as YesOrNo

  const personalAllowanceUsage = getValueViaPath(
    answers,
    'paymentInfo.personalAllowanceUsage',
  ) as string

  const taxLevel = getValueViaPath(
    answers,
    'paymentInfo.taxLevel',
  ) as TaxLevelOptions
  
  return {
    applicantPhonenumber,
    comment,
    bank,
    personalAllowance,
    personalAllowanceUsage,
    taxLevel,
  }
}

export const getApplicationExternalData = (
  externalData: Application['externalData'],
) => {
  const applicantName = getValueViaPath(
    externalData,
    'nationalRegistry.data.fullName',
  ) as string

  const applicantNationalId = getValueViaPath(
    externalData,
    'nationalRegistry.data.nationalId',
  ) as string

  const applicantAddress = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.streetAddress',
  ) as string

  const applicantPostalCode = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.postalCode',
  ) as string

  const applicantLocality = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.locality',
  ) as string

  const applicantMunicipality = applicantPostalCode + ', ' + applicantLocality

  const bankInfo = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationApplicant.data.bankAccount',
  ) as BankInfo

  const userProfileEmail = getValueViaPath(
    externalData,
    'userProfile.data.email',
  ) as string

  const userProfilePhoneNumber = getValueViaPath(
    externalData,
    'userProfile.data.mobilePhoneNumber',
  ) as string

  const spouseName = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data.name',
  ) as string

  const spouseNationalId = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data.nationalId',
  ) as string

  const maritalStatus = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data.maritalStatus',
  ) as string

  const hasSpouse = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data',
  ) as object

  return {
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantPostalCode,
    applicantLocality,
    applicantMunicipality,
    bankInfo,
    userProfileEmail,
    userProfilePhoneNumber,
    spouseName,
    spouseNationalId,
    maritalStatus,
    hasSpouse,
  }
}
