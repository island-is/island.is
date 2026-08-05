import { getValueViaPath, YesOrNoEnum, YES } from '@island.is/application/core'
import { FormValue, ExternalData } from '@island.is/application/types'
import {
  GaldurExternalDomainRequestsUpdateApplicantRequest,
  GaldurDomainModelsSettingsBanksBankDTO,
  GaldurDomainModelsSettingsLedgersLedgerDTO,
  GaldurExternalDomainModelsEducationDTO,
  GaldurExternalDomainModelsApplicantLanguageAbilityDTO,
} from '@island.is/clients/vmst-unemployment'
import {
  EducationInAnswers,
  LicenseInAnswers,
  LanguagesInAnswers,
  BankAccountInAnswers,
  OtherAddressInAnswers,
} from '@island.is/application/templates/vmst/edit-unemployment-information'

export const generateAnswers = (
  answers: FormValue,
  externalData: ExternalData,
): GaldurExternalDomainRequestsUpdateApplicantRequest => {
  const otherAddress = getValueViaPath<OtherAddressInAnswers>(
    answers,
    'otherAddress',
  )

  const password = getValueViaPath<string>(answers, 'password')

  const bankAccount = getValueViaPath<BankAccountInAnswers>(
    answers,
    'bankAccount',
  )

  const bankLedgerValues = getBankLedgerIds(
    externalData,
    bankAccount?.bankNumber || '',
    bankAccount?.ledger || '',
  )

  const jobWishes = getValueViaPath<Array<string>>(answers, 'jobWishes')

  const educationHistory = getValueViaPath<Array<EducationInAnswers>>(
    answers,
    'educationHistory',
  )

  const licenses = getValueViaPath<LicenseInAnswers>(answers, 'licenses')

  const languages = getValueViaPath<Array<LanguagesInAnswers>>(
    answers,
    'languageSkills',
  )

  const euresAgreement = getValueViaPath<YesOrNoEnum>(answers, 'euresAgreement')

  const previousEducationHistory =
    getValueViaPath<Array<GaldurExternalDomainModelsEducationDTO>>(
      externalData,
      'currentApplicationInformation.data.currentApplication.educationHistory',
    ) || []

  const combinedEducation: GaldurExternalDomainModelsEducationDTO[] = [
    ...previousEducationHistory,
    ...(educationHistory?.map((x) => ({
      educationProgramId: x.levelOfStudy ?? '',
      educationDegreeId: x.degree ?? '',
      educationSubjectId: x.courseOfStudy ?? '',
      yearFinished: x.endDate ? parseInt(x.endDate, 10) : null,
    })) ?? []),
  ]

  const previousLanguageSkills =
    getValueViaPath<
      Array<GaldurExternalDomainModelsApplicantLanguageAbilityDTO>
    >(
      externalData,
      'currentApplicationInformation.data.currentApplication.languageAbility',
    ) || []

  const combinedLanguageSkills: GaldurExternalDomainModelsApplicantLanguageAbilityDTO[] =
    [
      ...previousLanguageSkills,
      ...(languages?.map((x) => ({
        languageId: x.language,
        abilityId: x.skill,
      })) ?? []),
    ]

  return {
    currentAddressDifferent:
      otherAddress?.currentAddressIsNotDifferent &&
      otherAddress?.currentAddressIsNotDifferent?.[0] === YES
        ? false
        : true,
    currentAddress: otherAddress?.otherAddress,
    currentPostCodeId: otherAddress?.otherPostcode,
    passCode: password,
    bankAccount: {
      bankId: bankLedgerValues?.bankId ?? '',
      ledgerId: bankLedgerValues?.ledgerId ?? '',
      accountNumber: bankAccount?.accountNumber ?? '',
    },
    preferredJobs: jobWishes?.map((x) => {
      return { jobCodeId: x }
    }),
    educationHistory: combinedEducation,
    drivingLicenses:
      licenses?.hasDrivingLicense?.[0] === YES
        ? licenses.drivingLicenseTypes
        : [],
    workMachineRights:
      licenses?.hasHeavyMachineryLicense?.[0] === YES
        ? licenses.heavyMachineryLicensesTypes
        : [],
    languageAbility: combinedLanguageSkills,
    saveEURES: euresAgreement === YES ? true : false,
  }
}

const getBankLedgerIds = (
  externalData: ExternalData,
  bankAnswer: string,
  ledgerAnswer: string,
) => {
  const bankOptions =
    getValueViaPath<Array<GaldurDomainModelsSettingsBanksBankDTO>>(
      externalData,
      'currentApplicationInformation.data.supportData.banks',
      [],
    ) || []

  const ledgerOptions =
    getValueViaPath<Array<GaldurDomainModelsSettingsLedgersLedgerDTO>>(
      externalData,
      'currentApplicationInformation.data.supportData.ledgers',
      [],
    ) || []

  return {
    bankId: bankOptions.find((x) => x.bankNo === bankAnswer)?.id,
    ledgerId: ledgerOptions.find((x) => x.number === ledgerAnswer)?.id,
  }
}
