import { getValueViaPath, YES, YesOrNo } from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { BankInfo } from '@island.is/application/templates/social-insurance-administration-core/types'
import { Application } from '@island.is/application/types'
import { NOT_APPLICABLE, NotApplicable } from '../utils/constants'
import { medicalAndRehabilitationPaymentsFormMessage } from './messages'
import { getYesNoOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const applicantPhonenumber = getValueViaPath(
    answers,
    'applicantInfo.phonenumber',
  ) as string

  const sickPayOption = getValueViaPath(answers, 'sickPay.option') as
    | YesOrNo
    | NotApplicable

  const sickPayDoesEndDate = getValueViaPath(
    answers,
    'sickPay.doesEndDate',
  ) as string

  const sickPayDidEndDate = getValueViaPath(
    answers,
    'sickPay.didEndDate',
  ) as string

  const comment = getValueViaPath(answers, 'comment') as string

  return {
    applicantPhonenumber,
    comment,
    sickPayOption,
    sickPayDidEndDate,
    sickPayDoesEndDate,
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

export const getYesNoNotApplicableOptions = () => {
  return [
    ...getYesNoOptions(),
    {
      value: NOT_APPLICABLE,
      dataTestId: 'sickPay-option-not-applicable',
      label: medicalAndRehabilitationPaymentsFormMessage.shared.notApplicable,
    },
  ]
}

export const getYesNoNotApplicableTranslation = (value: string) => {
  if (value === NOT_APPLICABLE) {
    return medicalAndRehabilitationPaymentsFormMessage.shared.notApplicable
  } else if (value === YES) {
    return socialInsuranceAdministrationMessage.shared.yes
  }
  return socialInsuranceAdministrationMessage.shared.no
}
