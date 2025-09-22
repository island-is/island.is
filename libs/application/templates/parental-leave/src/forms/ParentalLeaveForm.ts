import addDays from 'date-fns/addDays'

import {
  buildAlertMessageField,
  buildAsyncSelectField,
  buildCustomField,
  buildDateField,
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildRepeater,
  buildSection,
  buildSelectField,
  buildSubmitField,
  buildSubSection,
  buildTableRepeaterField,
  buildTextField,
  buildSliderField,
  formatText,
  NO_ANSWER,
  YES,
  NO,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
} from '@island.is/application/types'

import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'

import Logo from '../assets/Logo'
import { maxDaysToGiveOrReceive } from '../config'
import {
  ADOPTION,
  FILE_SIZE_LIMIT,
  Languages,
  MANUAL,
  NO_PRIVATE_PENSION_FUND,
  NO_UNION,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
  ParentalRelations,
  PERMANENT_FOSTER_CARE,
  SINGLE,
  SPOUSE,
  StartDateOptions,
  UnEmployedBenefitTypes,
} from '../constants'
import {
  GetPensionFunds,
  GetPrivatePensionFunds,
  GetUnions,
} from '../graphql/queries'
import { parentalLeaveFormMessages } from '../lib/messages'
import {
  allowOtherParent,
  allowOtherParentToUsePersonalAllowance,
  getAllPeriodDates,
  getApplicationAnswers,
  getApplicationExternalData,
  getBeginningOfMonth3MonthsAgo,
  getConclusionScreenSteps,
  getDurationTitle,
  getFirstPeriodTitle,
  getLeavePlanTitle,
  getMaxMultipleBirthsDays,
  getMinimumEndDate,
  getMinimumStartDate,
  getMultipleBirthRequestDays,
  getOtherParentOptions,
  getPeriodSectionTitle,
  getRatioTitle,
  getRightsDescTitle,
  getSelectedChild,
  getSpouse,
  getStartDateDesc,
  getStartDateTitle,
  isParentWithoutBirthParent,
  requiresOtherParentApproval,
} from '../lib/parentalLeaveUtils'
import { Query } from '@island.is/api/schema'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { useLocale } from '@island.is/localization'
import { theme } from '@island.is/island-ui/theme'

export const ParentalLeaveForm: Form = buildForm({
  id: 'ParentalLeaveDraft',
  title: parentalLeaveFormMessages.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'theApplicant',
      title: parentalLeaveFormMessages.shared.applicantSection,
      children: [
        buildSubSection({
          id: 'emailAndPhoneNumber',
          title: parentalLeaveFormMessages.applicant.subSection,
          children: [
            buildMultiField({
              id: 'infoSection',
              title: parentalLeaveFormMessages.applicant.subSection,
              children: [
                buildDescriptionField({
                  id: 'contactInfo',
                  title: parentalLeaveFormMessages.applicant.title,
                  titleVariant: 'h4',
                  description: parentalLeaveFormMessages.applicant.description,
                }),
                buildTextField({
                  width: 'half',
                  title: parentalLeaveFormMessages.applicant.email,
                  dataTestId: 'email',
                  id: 'applicant.email',
                  variant: 'email',
                  defaultValue: (application: Application) =>
                    (
                      application.externalData.userProfile?.data as {
                        email?: string
                      }
                    )?.email,
                }),
                buildTextField({
                  width: 'half',
                  title: parentalLeaveFormMessages.applicant.phoneNumber,
                  defaultValue: (application: Application) => {
                    const phoneNumber = (
                      application.externalData.userProfile?.data as {
                        mobilePhoneNumber?: string
                      }
                    )?.mobilePhoneNumber

                    return formatPhoneNumber(
                      removeCountryCode(phoneNumber ?? ''),
                    )
                  },
                  id: 'applicant.phoneNumber',
                  dataTestId: 'phone',
                  variant: 'tel',
                  format: '###-####',
                  placeholder: '000-0000',
                }),
                buildRadioField({
                  id: 'applicant.language',
                  title: parentalLeaveFormMessages.applicant.languageTitle,
                  width: 'half',
                  required: true,
                  space: 3,
                  options: [
                    {
                      value: Languages.IS,
                      label: parentalLeaveFormMessages.applicant.icelandic,
                    },
                    {
                      value: Languages.EN,
                      label: parentalLeaveFormMessages.applicant.english,
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'otherParentObj',
          title: parentalLeaveFormMessages.shared.otherParentSubSection,
          condition: (answers, externalData) => {
            const selectedChild = getSelectedChild(answers, externalData)

            if (selectedChild !== null) {
              return (
                selectedChild.parentalRelation === ParentalRelations.primary
              )
            }

            return true
          },
          children: [
            buildMultiField({
              id: 'otherParentSpouse',
              condition: (_, externalData) => {
                const application = { externalData } as Application
                const spouse = getSpouse(application)
                return !!spouse
              },
              title: parentalLeaveFormMessages.shared.otherParentTitle,
              description: parentalLeaveFormMessages.shared.otherParentSpouse,
              children: [
                buildTextField({
                  id: 'otherParentSpouse.otherParentName',
                  dataTestId: 'other-parent-name',
                  title: parentalLeaveFormMessages.shared.otherParentName,
                  width: 'half',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const spouse = getSpouse(application)
                    return spouse?.name
                  },
                }),
                buildTextField({
                  id: 'otherParentSpouse.otherParentId',
                  dataTestId: 'other-parent-kennitala',
                  title: parentalLeaveFormMessages.shared.otherParentID,
                  width: 'half',
                  format: '######-####',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const spouse = getSpouse(application)
                    return spouse?.nationalId
                  },
                }),
              ],
            }),
            buildMultiField({
              id: 'otherParentObj',
              condition: (_, externalData) => {
                const application = { externalData } as Application
                const spouse = getSpouse(application)
                return !spouse
              },
              title: parentalLeaveFormMessages.shared.otherParentTitle,
              description:
                parentalLeaveFormMessages.shared.otherParentDescription,
              children: [
                buildRadioField({
                  id: 'otherParentObj.chooseOtherParent',
                  options: getOtherParentOptions,
                }),
                buildTextField({
                  id: 'otherParentObj.otherParentName',
                  dataTestId: 'other-parent-name',
                  condition: (answers) =>
                    (
                      answers as {
                        otherParentObj: {
                          chooseOtherParent: string
                        }
                      }
                    )?.otherParentObj?.chooseOtherParent === MANUAL,
                  title: parentalLeaveFormMessages.shared.otherParentName,
                  width: 'half',
                }),
                buildTextField({
                  id: 'otherParentObj.otherParentId',
                  dataTestId: 'other-parent-kennitala',
                  condition: (answers) =>
                    (
                      answers as {
                        otherParentObj: {
                          chooseOtherParent: string
                        }
                      }
                    )?.otherParentObj?.chooseOtherParent === MANUAL,
                  title: parentalLeaveFormMessages.shared.otherParentID,
                  width: 'half',
                  format: '######-####',
                  placeholder: '000000-0000',
                }),
              ],
            }),
            buildRadioField({
              id: 'otherParentRightOfAccess',
              condition: (answers) =>
                (
                  answers as {
                    otherParentObj: {
                      chooseOtherParent: string
                    }
                  }
                )?.otherParentObj?.chooseOtherParent === MANUAL,
              title: parentalLeaveFormMessages.rightOfAccess.title,
              description: parentalLeaveFormMessages.rightOfAccess.description,
              defaultValue: YES,
              options: [
                {
                  label: parentalLeaveFormMessages.rightOfAccess.yesOption,
                  dataTestId: 'yes-option',
                  value: YES,
                },
                {
                  label: parentalLeaveFormMessages.rightOfAccess.noOption,
                  dataTestId: 'no-option',
                  value: NO,
                },
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'payments',
          title: parentalLeaveFormMessages.shared.paymentInformationSubSection,
          children: [
            buildMultiField({
              title: parentalLeaveFormMessages.shared.paymentInformationName,
              id: 'payments',
              children: [
                buildTextField({
                  title:
                    parentalLeaveFormMessages.shared.paymentInformationBank,
                  id: 'payments.bank',
                  dataTestId: 'bank-account-number',
                  format: '####-##-######',
                  placeholder: '0000-00-000000',
                  defaultValue: (application: Application) =>
                    (
                      application.externalData.userProfile?.data as {
                        bankInfo?: string
                      }
                    )?.bankInfo,
                }),
                buildAsyncSelectField({
                  condition: (answers) => {
                    const { applicationType } = getApplicationAnswers(answers)

                    return applicationType === PARENTAL_LEAVE
                  },
                  title: parentalLeaveFormMessages.shared.pensionFund,
                  id: 'payments.pensionFund',
                  loadingError: parentalLeaveFormMessages.errors.loading,
                  isSearchable: true,
                  dataTestId: `pension-fund`,
                  placeholder:
                    parentalLeaveFormMessages.shared.asyncSelectSearchableHint,
                  loadOptions: async ({ apolloClient }) => {
                    const { data } = await apolloClient.query<Query>({
                      query: GetPensionFunds,
                    })

                    return (
                      data?.getPensionFunds?.map(({ id, name }) => ({
                        label: name,
                        dataTestId: 'pension-fund-item',
                        value: id,
                      })) ?? []
                    )
                  },
                }),
                buildRadioField({
                  id: 'payments.useUnion',
                  title: parentalLeaveFormMessages.shared.unionName,
                  description:
                    parentalLeaveFormMessages.shared.unionDescription,
                  condition: (answers) => {
                    const { applicationType } = getApplicationAnswers(answers)

                    return applicationType === PARENTAL_LEAVE
                  },
                  space: 6,
                  width: 'half',
                  required: true,
                  options: [
                    {
                      label: parentalLeaveFormMessages.shared.yesOptionLabel,
                      dataTestId: 'use-union',
                      value: YES,
                    },
                    {
                      label: parentalLeaveFormMessages.shared.noOptionLabel,
                      dataTestId: 'dont-use-union',
                      value: NO,
                    },
                  ],
                }),
                buildAsyncSelectField({
                  condition: (answers) => {
                    const { applicationType, useUnion } =
                      getApplicationAnswers(answers)
                    return (
                      applicationType === PARENTAL_LEAVE && useUnion === YES
                    )
                  },
                  title: parentalLeaveFormMessages.shared.union,
                  id: 'payments.union',
                  loadingError: parentalLeaveFormMessages.errors.loading,
                  dataTestId: 'payments-union',
                  isSearchable: true,
                  placeholder:
                    parentalLeaveFormMessages.shared.asyncSelectSearchableHint,
                  loadOptions: async ({ apolloClient }) => {
                    const { data } = await apolloClient.query<Query>({
                      query: GetUnions,
                    })

                    return (
                      data?.getUnions
                        ?.filter(({ id }) => id !== NO_UNION)
                        .map(({ id, name }) => ({
                          label: name,
                          value: id,
                        })) ?? []
                    )
                  },
                }),
                buildRadioField({
                  id: 'payments.usePrivatePensionFund',
                  title:
                    parentalLeaveFormMessages.shared.privatePensionFundName,
                  description:
                    parentalLeaveFormMessages.shared
                      .privatePensionFundDescription,
                  condition: (answers) => {
                    const { applicationType } = getApplicationAnswers(answers)

                    return applicationType === PARENTAL_LEAVE
                  },
                  space: 6,
                  width: 'half',
                  required: true,
                  options: [
                    {
                      label: parentalLeaveFormMessages.shared.yesOptionLabel,
                      dataTestId: 'use-private-pension-fund',
                      value: YES,
                    },
                    {
                      label: parentalLeaveFormMessages.shared.noOptionLabel,
                      dataTestId: 'dont-use-private-pension-fund',
                      value: NO,
                    },
                  ],
                }),
                buildAsyncSelectField({
                  condition: (answers) => {
                    const { applicationType, usePrivatePensionFund } =
                      getApplicationAnswers(answers)
                    return (
                      applicationType === PARENTAL_LEAVE &&
                      usePrivatePensionFund === YES
                    )
                  },
                  id: 'payments.privatePensionFund',
                  title: parentalLeaveFormMessages.shared.privatePensionFund,
                  loadingError: parentalLeaveFormMessages.errors.loading,
                  dataTestId: 'private-pension-fund',
                  isSearchable: true,
                  loadOptions: async ({ apolloClient }) => {
                    const { data } = await apolloClient.query<Query>({
                      query: GetPrivatePensionFunds,
                    })

                    return (
                      data?.getPrivatePensionFunds
                        ?.filter(({ id }) => id !== NO_PRIVATE_PENSION_FUND)
                        .map(({ id, name }) => ({
                          label: name,
                          value: id,
                        })) ?? []
                    )
                  },
                }),
                buildSelectField({
                  condition: (answers) => {
                    const { applicationType, usePrivatePensionFund } =
                      getApplicationAnswers(answers)
                    return (
                      applicationType === PARENTAL_LEAVE &&
                      usePrivatePensionFund === YES
                    )
                  },
                  id: 'payments.privatePensionFundPercentage',
                  dataTestId: 'private-pension-fund-ratio',
                  title:
                    parentalLeaveFormMessages.shared.privatePensionFundRatio,
                  options: [
                    { label: '2%', value: '2' },
                    { label: '4%', value: '4' },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'personalAllowanceSubSection',
          title: parentalLeaveFormMessages.personalAllowance.title,
          children: [
            buildMultiField({
              id: 'personalAllowance',
              title: parentalLeaveFormMessages.personalAllowance.title,
              description:
                parentalLeaveFormMessages.personalAllowance.description,
              children: [
                buildAlertMessageField({
                  id: 'personalAllowance.alertMessage',
                  title: parentalLeaveFormMessages.employer.alertTitle,
                  message:
                    parentalLeaveFormMessages.personalAllowance
                      .alertDescription,
                  doesNotRequireAnswer: true,
                  alertType: 'info',
                  marginTop: 0,
                }),
                buildRadioField({
                  id: 'personalAllowance.usePersonalAllowance',
                  title: parentalLeaveFormMessages.personalAllowance.useYours,
                  width: 'half',
                  required: true,
                  options: [
                    {
                      label: parentalLeaveFormMessages.shared.yesOptionLabel,
                      dataTestId: 'use-personal-finance',
                      value: YES,
                    },
                    {
                      label: parentalLeaveFormMessages.shared.noOptionLabel,
                      dataTestId: 'dont-use-personal-finance',
                      value: NO,
                    },
                  ],
                }),
                buildRadioField({
                  id: 'personalAllowance.useAsMuchAsPossible',
                  title:
                    parentalLeaveFormMessages.personalAllowance
                      .useAsMuchAsPossible,
                  width: 'half',
                  options: [
                    {
                      label: parentalLeaveFormMessages.shared.yesOptionLabel,
                      dataTestId: 'use-as-much-as-possible',
                      value: YES,
                    },
                    {
                      label: parentalLeaveFormMessages.shared.noOptionLabel,
                      dataTestId: 'dont-use-as-much-as-possible',
                      value: NO,
                    },
                  ],
                  condition: (answers) =>
                    (
                      answers as {
                        personalAllowance: { usePersonalAllowance: string }
                      }
                    )?.personalAllowance?.usePersonalAllowance === YES,
                }),
                buildTextField({
                  id: 'personalAllowance.usage',
                  title:
                    parentalLeaveFormMessages.personalAllowance.oneToHundred,
                  description:
                    parentalLeaveFormMessages.personalAllowance.manual,
                  suffix: '%',
                  condition: (answers) => {
                    const usingAsMuchAsPossible =
                      (
                        answers as {
                          personalAllowance: { useAsMuchAsPossible: string }
                        }
                      )?.personalAllowance?.useAsMuchAsPossible === NO
                    const usingPersonalAllowance =
                      (
                        answers as {
                          personalAllowance: { usePersonalAllowance: string }
                        }
                      )?.personalAllowance?.usePersonalAllowance === YES

                    return usingAsMuchAsPossible && usingPersonalAllowance
                  },
                  placeholder: '1%',
                  variant: 'number',
                  width: 'half',
                  maxLength: 4,
                }),
              ],
            }),
            buildMultiField({
              id: 'personalAllowanceFromSpouse',
              title: parentalLeaveFormMessages.personalAllowance.spouseTitle,
              description:
                parentalLeaveFormMessages.personalAllowance.spouseDescription,
              condition: (answers, externalData) => {
                const selectedChild = getSelectedChild(answers, externalData)

                return (
                  selectedChild?.parentalRelation ===
                    ParentalRelations.primary &&
                  allowOtherParentToUsePersonalAllowance(answers)
                )
              },
              children: [
                buildRadioField({
                  id: 'personalAllowanceFromSpouse.usePersonalAllowance',
                  title:
                    parentalLeaveFormMessages.personalAllowance.useFromSpouse,
                  width: 'half',
                  required: true,
                  options: [
                    {
                      label: parentalLeaveFormMessages.shared.yesOptionLabel,
                      dataTestId: 'use-personal-finance',
                      value: YES,
                    },
                    {
                      label: parentalLeaveFormMessages.shared.noOptionLabel,
                      dataTestId: 'dont-use-personal-finance',
                      value: NO,
                    },
                  ],
                }),
                buildRadioField({
                  id: 'personalAllowanceFromSpouse.useAsMuchAsPossible',
                  title:
                    parentalLeaveFormMessages.personalAllowance
                      .useAsMuchAsPossibleFromSpouse,
                  width: 'half',
                  options: [
                    {
                      label: parentalLeaveFormMessages.shared.yesOptionLabel,
                      dataTestId: 'use-as-much-as-possible',
                      value: YES,
                    },
                    {
                      label: parentalLeaveFormMessages.shared.noOptionLabel,
                      dataTestId: 'dont-use-as-much-as-possible',
                      value: NO,
                    },
                  ],
                  condition: (answers) =>
                    (
                      answers as {
                        personalAllowanceFromSpouse: {
                          usePersonalAllowance: string
                        }
                      }
                    )?.personalAllowanceFromSpouse?.usePersonalAllowance ===
                      YES && allowOtherParent(answers),
                }),
                buildTextField({
                  id: 'personalAllowanceFromSpouse.usage',
                  title:
                    parentalLeaveFormMessages.personalAllowance.oneToHundred,
                  description:
                    parentalLeaveFormMessages.personalAllowance.manual,
                  suffix: '%',
                  condition: (answers) => {
                    const usingAsMuchAsPossible =
                      (
                        answers as {
                          personalAllowanceFromSpouse: {
                            useAsMuchAsPossible: string
                          }
                        }
                      )?.personalAllowanceFromSpouse?.useAsMuchAsPossible === NO
                    const usingPersonalAllowance =
                      (
                        answers as {
                          personalAllowanceFromSpouse: {
                            usePersonalAllowance: string
                          }
                        }
                      )?.personalAllowanceFromSpouse?.usePersonalAllowance ===
                      YES

                    return usingAsMuchAsPossible && usingPersonalAllowance
                  },
                  placeholder: '1%',
                  variant: 'number',
                  width: 'half',
                  maxLength: 4,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'employmentSubSection',
          title: parentalLeaveFormMessages.employer.subSection,
          condition: (answers) => {
            const { applicationType } = getApplicationAnswers(answers)
            return applicationType === PARENTAL_LEAVE
          },
          children: [
            buildMultiField({
              id: 'employment',
              children: [
                buildDescriptionField({
                  id: 'employment.isSelfEmployed.description',
                  title: parentalLeaveFormMessages.selfEmployed.title,
                  description:
                    parentalLeaveFormMessages.selfEmployed.description,
                  titleVariant: 'h2',
                }),
                buildRadioField({
                  id: 'employment.isSelfEmployed',
                  width: 'half',
                  required: true,
                  options: [
                    {
                      label: parentalLeaveFormMessages.shared.yesOptionLabel,
                      value: YES,
                    },
                    {
                      label: parentalLeaveFormMessages.shared.noOptionLabel,
                      value: NO,
                    },
                  ],
                }),
                buildDescriptionField({
                  id: 'employment.isReceivingUnemploymentBenefits.description',
                  title:
                    parentalLeaveFormMessages.employer
                      .isReceivingUnemploymentBenefitsTitle,
                  description:
                    parentalLeaveFormMessages.employer
                      .isReceivingUnemploymentBenefitsDescription,
                  titleVariant: 'h2',
                  marginTop: 3,
                  condition: (answers) => {
                    const { isSelfEmployed } = getApplicationAnswers(answers)
                    return isSelfEmployed === NO
                  },
                }),
                buildAlertMessageField({
                  id: 'employment.isReceivingUnemploymentBenefits.alertMessage',
                  title: parentalLeaveFormMessages.employer.alertTitle,
                  message: parentalLeaveFormMessages.employer.alertDescription,
                  doesNotRequireAnswer: true,
                  alertType: 'info',
                  condition: (answers) => {
                    const { isSelfEmployed } = getApplicationAnswers(answers)
                    return isSelfEmployed === NO
                  },
                }),
                buildRadioField({
                  id: 'employment.isReceivingUnemploymentBenefits',
                  width: 'half',
                  options: [
                    {
                      label: parentalLeaveFormMessages.shared.yesOptionLabel,
                      value: YES,
                    },
                    {
                      label: parentalLeaveFormMessages.shared.noOptionLabel,
                      value: NO,
                    },
                  ],
                  condition: (answers) => {
                    const { isSelfEmployed } = getApplicationAnswers(answers)
                    return isSelfEmployed === NO
                  },
                }),
                buildSelectField({
                  id: 'employment.unemploymentBenefits',
                  title:
                    parentalLeaveFormMessages.employer.unemploymentBenefits,
                  options: [
                    {
                      label: UnEmployedBenefitTypes.vmst,
                      value: UnEmployedBenefitTypes.vmst,
                    },
                    {
                      label: UnEmployedBenefitTypes.union,
                      value: UnEmployedBenefitTypes.union,
                    },
                    {
                      label: UnEmployedBenefitTypes.healthInsurance,
                      value: UnEmployedBenefitTypes.healthInsurance,
                    },
                    {
                      label: UnEmployedBenefitTypes.other,
                      value: UnEmployedBenefitTypes.other,
                    },
                  ],
                  condition: (answers) => {
                    const { isSelfEmployed, isReceivingUnemploymentBenefits } =
                      getApplicationAnswers(answers)

                    return (
                      isSelfEmployed === NO &&
                      isReceivingUnemploymentBenefits === YES
                    )
                  },
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          condition: (answers) => {
            const { applicationType } = getApplicationAnswers(answers)

            return (
              applicationType === PARENTAL_GRANT ||
              applicationType === PARENTAL_GRANT_STUDENTS
            )
          },
          id: 'parentalGrantEmployment',
          title: parentalLeaveFormMessages.employer.subSection,
          children: [
            buildRadioField({
              id: 'employerLastSixMonths',
              title: parentalLeaveFormMessages.employer.employerLastSixMonths,
              width: 'half',
              required: true,
              options: [
                {
                  value: YES,
                  label: parentalLeaveFormMessages.shared.yesOptionLabel,
                },
                {
                  value: NO,
                  label: parentalLeaveFormMessages.shared.noOptionLabel,
                },
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'employment',
          title: parentalLeaveFormMessages.employer.subSection,
          condition: (answers) => {
            const {
              applicationType,
              isReceivingUnemploymentBenefits,
              isSelfEmployed,
              employerLastSixMonths,
            } = getApplicationAnswers(answers)
            const isNotSelfEmployed = isSelfEmployed !== YES

            return (
              (applicationType === PARENTAL_LEAVE &&
                isReceivingUnemploymentBenefits === NO &&
                isNotSelfEmployed) ||
              ((applicationType === PARENTAL_GRANT ||
                applicationType === PARENTAL_GRANT_STUDENTS) &&
                employerLastSixMonths === YES)
            )
          },
          children: [
            buildTableRepeaterField({
              id: 'employers',
              title: parentalLeaveFormMessages.employer.title,
              description: (application) => {
                const { employerLastSixMonths } = getApplicationAnswers(
                  application.answers,
                )
                return employerLastSixMonths === YES
                  ? parentalLeaveFormMessages.employer.grantsDescription
                  : parentalLeaveFormMessages.employer.description
              },
              formTitle: parentalLeaveFormMessages.employer.registration,
              addItemButtonText: parentalLeaveFormMessages.employer.addEmployer,
              saveItemButtonText:
                parentalLeaveFormMessages.employer.registerEmployer,
              removeButtonTooltipText:
                parentalLeaveFormMessages.employer.deleteEmployer,
              editButtonTooltipText:
                parentalLeaveFormMessages.employer.editEmployer,
              editField: true,
              marginTop: 0,
              fields: {
                email: {
                  component: 'input',
                  label: parentalLeaveFormMessages.employer.email,
                  type: 'email',
                  dataTestId: 'employer-email',
                },
                phoneNumber: {
                  component: 'input',
                  label: parentalLeaveFormMessages.employer.phoneNumber,
                  type: 'tel',
                  format: '###-####',
                  placeholder: '000-0000',
                  dataTestId: 'employer-phone-number',
                },
                ratio: {
                  component: 'select',
                  label: parentalLeaveFormMessages.employer.ratio,
                  placeholder:
                    parentalLeaveFormMessages.employer.ratioPlaceholder,
                  dataTestId: 'employment-ratio',
                  options: Array(100)
                    .fill(undefined)
                    .map((_, idx, array) => ({
                      value: `${array.length - idx}`,
                      label: `${array.length - idx}%`,
                    })),
                },
                stillEmployed: {
                  component: 'radio',
                  label: parentalLeaveFormMessages.employer.stillEmployed,
                  width: 'half',
                  options: [
                    {
                      value: YES,
                      label: parentalLeaveFormMessages.shared.yesOptionLabel,
                    },
                    {
                      value: NO,
                      label: parentalLeaveFormMessages.shared.noOptionLabel,
                    },
                  ],
                  displayInTable: false,
                  condition: (application) => {
                    const { applicationType, employerLastSixMonths } =
                      getApplicationAnswers(application.answers)

                    return (
                      (applicationType === PARENTAL_GRANT ||
                        applicationType === PARENTAL_GRANT_STUDENTS) &&
                      employerLastSixMonths === YES
                    )
                  },
                },
              },
              table: {
                header: [
                  parentalLeaveFormMessages.employer.emailHeader,
                  parentalLeaveFormMessages.employer.phoneNumberHeader,
                  parentalLeaveFormMessages.employer.ratioHeader,
                ],
                format: {
                  phoneNumber: (value) =>
                    formatPhoneNumber(removeCountryCode(value ?? '')),
                  ratio: (value) => `${value}%`,
                },
              },
            }),
          ],
        }),
        buildSubSection({
          id: 'fileUpload',
          title: parentalLeaveFormMessages.attachmentScreen.title,
          condition: (answers) => {
            const {
              isReceivingUnemploymentBenefits,
              isSelfEmployed,
              unemploymentBenefits,
              noChildrenFoundTypeOfApplication,
              applicationType,
              employerLastSixMonths,
              isNotStillEmployed,
              otherParent,
            } = getApplicationAnswers(answers)

            const benefitsFile =
              isSelfEmployed === NO &&
              isReceivingUnemploymentBenefits === YES &&
              (unemploymentBenefits === UnEmployedBenefitTypes.union ||
                unemploymentBenefits === UnEmployedBenefitTypes.healthInsurance)

            const employmentTerminationCertificateFile =
              (applicationType === PARENTAL_GRANT ||
                applicationType === PARENTAL_GRANT_STUDENTS) &&
              employerLastSixMonths === YES &&
              isNotStillEmployed

            return (
              isSelfEmployed === YES ||
              applicationType === PARENTAL_GRANT_STUDENTS ||
              benefitsFile ||
              otherParent === SINGLE ||
              isParentWithoutBirthParent(answers) ||
              noChildrenFoundTypeOfApplication === PERMANENT_FOSTER_CARE ||
              noChildrenFoundTypeOfApplication === ADOPTION ||
              employmentTerminationCertificateFile
            )
          },
          children: [
            buildFileUploadField({
              id: 'fileUpload.selfEmployedFile',
              title: parentalLeaveFormMessages.selfEmployed.attachmentTitle,
              description:
                parentalLeaveFormMessages.selfEmployed.attachmentDescription,
              introduction:
                parentalLeaveFormMessages.selfEmployed.attachmentDescription,
              condition: (answers) => {
                const { isSelfEmployed } = getApplicationAnswers(answers)

                return isSelfEmployed === YES
              },
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                parentalLeaveFormMessages.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: parentalLeaveFormMessages.fileUpload.uploadHeader,
              uploadDescription:
                parentalLeaveFormMessages.fileUpload.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.fileUpload.attachmentButton,
            }),
            buildFileUploadField({
              id: 'fileUpload.studentFile',
              title: parentalLeaveFormMessages.attachmentScreen.studentTitle,
              introduction:
                parentalLeaveFormMessages.attachmentScreen.studentDescription,
              condition: (answers) =>
                (
                  answers as {
                    applicationType: {
                      option: string
                    }
                  }
                )?.applicationType?.option === PARENTAL_GRANT_STUDENTS,
              maxSizeErrorText:
                parentalLeaveFormMessages.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: parentalLeaveFormMessages.fileUpload.uploadHeader,
              uploadDescription:
                parentalLeaveFormMessages.fileUpload.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.fileUpload.attachmentButton,
            }),
            buildFileUploadField({
              id: 'fileUpload.benefitsFile',
              title:
                parentalLeaveFormMessages.attachmentScreen
                  .unemploymentBenefitsTitle,
              introduction:
                parentalLeaveFormMessages.attachmentScreen.benefitDescription,
              condition: (answers) => {
                const {
                  isReceivingUnemploymentBenefits,
                  isSelfEmployed,
                  unemploymentBenefits,
                } = getApplicationAnswers(answers)

                return (
                  isSelfEmployed === NO &&
                  isReceivingUnemploymentBenefits === YES &&
                  (unemploymentBenefits === UnEmployedBenefitTypes.union ||
                    unemploymentBenefits ===
                      UnEmployedBenefitTypes.healthInsurance)
                )
              },
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                parentalLeaveFormMessages.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: parentalLeaveFormMessages.fileUpload.uploadHeader,
              uploadDescription:
                parentalLeaveFormMessages.fileUpload.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.fileUpload.attachmentButton,
            }),
            buildFileUploadField({
              id: 'fileUpload.singleParent',
              title:
                parentalLeaveFormMessages.attachmentScreen.singleParentTitle,
              introduction:
                parentalLeaveFormMessages.attachmentScreen
                  .singleParentDescription,
              condition: (answers) =>
                (
                  answers as {
                    otherParentObj: {
                      chooseOtherParent: string
                    }
                  }
                )?.otherParentObj?.chooseOtherParent === SINGLE,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                parentalLeaveFormMessages.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: parentalLeaveFormMessages.fileUpload.uploadHeader,
              uploadDescription:
                parentalLeaveFormMessages.fileUpload.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.fileUpload.attachmentButton,
            }),
            buildFileUploadField({
              id: 'fileUpload.parentWithoutBirthParent',
              title:
                parentalLeaveFormMessages.attachmentScreen
                  .parentWithoutBirthParentTitle,
              introduction:
                parentalLeaveFormMessages.attachmentScreen
                  .parentWithoutBirthParentDescription,
              condition: (answers) => isParentWithoutBirthParent(answers),
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                parentalLeaveFormMessages.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: parentalLeaveFormMessages.fileUpload.uploadHeader,
              uploadDescription:
                parentalLeaveFormMessages.fileUpload.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.fileUpload.attachmentButton,
            }),
            buildFileUploadField({
              id: 'fileUpload.permanentFosterCare',
              title:
                parentalLeaveFormMessages.attachmentScreen
                  .permanentFostercareTitle,
              introduction:
                parentalLeaveFormMessages.attachmentScreen
                  .permanentFostercareDescription,
              condition: (answers) => {
                const { noChildrenFoundTypeOfApplication } =
                  getApplicationAnswers(answers)

                return (
                  noChildrenFoundTypeOfApplication === PERMANENT_FOSTER_CARE
                )
              },
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                parentalLeaveFormMessages.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: parentalLeaveFormMessages.fileUpload.uploadHeader,
              uploadDescription:
                parentalLeaveFormMessages.fileUpload.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.fileUpload.attachmentButton,
            }),
            buildFileUploadField({
              id: 'fileUpload.adoption',
              title: parentalLeaveFormMessages.attachmentScreen.adoptionTitle,
              introduction:
                parentalLeaveFormMessages.attachmentScreen.adoptionDescription,
              condition: (answers) => {
                const { noChildrenFoundTypeOfApplication } =
                  getApplicationAnswers(answers)

                return noChildrenFoundTypeOfApplication === ADOPTION
              },
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                parentalLeaveFormMessages.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: parentalLeaveFormMessages.fileUpload.uploadHeader,
              uploadDescription:
                parentalLeaveFormMessages.fileUpload.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.fileUpload.attachmentButton,
            }),
            buildFileUploadField({
              id: 'fileUpload.employmentTerminationCertificateFile',
              title:
                parentalLeaveFormMessages.attachmentScreen
                  .employmentTerminationCertificateTitle,
              introduction:
                parentalLeaveFormMessages.attachmentScreen
                  .employmentTerminationCertificateDescription,
              condition: (answers) => {
                const {
                  applicationType,
                  employerLastSixMonths,
                  isNotStillEmployed,
                } = getApplicationAnswers(answers)

                return (
                  (applicationType === PARENTAL_GRANT ||
                    applicationType === PARENTAL_GRANT_STUDENTS) &&
                  employerLastSixMonths === YES &&
                  isNotStillEmployed
                )
              },
              maxSizeErrorText:
                parentalLeaveFormMessages.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: parentalLeaveFormMessages.fileUpload.uploadHeader,
              uploadDescription:
                parentalLeaveFormMessages.fileUpload.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.fileUpload.attachmentButton,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'rights',
      title: parentalLeaveFormMessages.shared.rightsSection,
      condition: (answers, externalData) => {
        const selectedChild = getSelectedChild(answers, externalData)
        return selectedChild?.parentalRelation === ParentalRelations.primary
      },
      children: [
        buildSubSection({
          id: 'rightsQuestions',
          title: parentalLeaveFormMessages.shared.yourRights,
          children: [
            buildMultiField({
              id: 'rightsIntro',
              title: parentalLeaveFormMessages.shared.theseAreYourRights,
              description: getRightsDescTitle,
              children: [
                buildCustomField({
                  id: 'rightsIntro',
                  doesNotRequireAnswer: true,
                  component: 'Rights',
                }),
              ],
            }),
            buildMultiField({
              id: 'multipleBirthsRequestDaysMultiField',
              title: parentalLeaveFormMessages.shared.multipleBirthsDaysTitle,
              description:
                parentalLeaveFormMessages.shared.multipleBirthsDaysDescription,
              condition: (answers, externalData) => {
                const canTransferRights =
                  getSelectedChild(answers, externalData)?.parentalRelation ===
                  ParentalRelations.primary
                const { hasMultipleBirths, otherParent } =
                  getApplicationAnswers(answers)

                return (
                  canTransferRights &&
                  hasMultipleBirths === YES &&
                  otherParent !== SINGLE
                )
              },
              children: [
                buildSliderField({
                  id: 'multipleBirthsRequestDays',
                  label: {
                    singular: parentalLeaveFormMessages.shared.day,
                    plural: parentalLeaveFormMessages.shared.days,
                  },
                  min: 0,
                  max: (application: Application) =>
                    getMaxMultipleBirthsDays(application.answers),
                  step: 1,
                  defaultValue: (application: Application) =>
                    getMultipleBirthRequestDays(application.answers),
                  showMinMaxLabels: true,
                  showToolTip: true,
                  trackStyle: { gridTemplateRows: 8 },
                  calculateCellStyle: () => {
                    return {
                      background: theme.color.dark200,
                    }
                  },
                  saveAsString: true,
                }),
                buildCustomField({
                  id: 'requestRights',
                  childInputIds: [
                    'requestRights.isRequestingRights',
                    'requestRights.requestDays',
                    'giveRights.isGivingRights',
                    'giveRights.giveDays',
                  ],
                  component: 'RequestMultipleBirthsDaysBoxChart',
                }),
              ],
            }),
            buildCustomField({
              id: 'transferRights',
              childInputIds: [
                'transferRights',
                'requestRights.isRequestingRights',
                'requestRights.requestDays',
                'giveRights.isGivingRights',
                'giveRights.giveDays',
              ],
              condition: (answers, externalData) => {
                const { hasMultipleBirths, otherParent } =
                  getApplicationAnswers(answers)

                const canTransferRights =
                  getSelectedChild(answers, externalData)?.parentalRelation ===
                    ParentalRelations.primary &&
                  (otherParent === SPOUSE || otherParent === MANUAL)

                const multipleBirthsRequestDays =
                  getMultipleBirthRequestDays(answers)

                return (
                  canTransferRights &&
                  (hasMultipleBirths === NO ||
                    multipleBirthsRequestDays ===
                      getMaxMultipleBirthsDays(answers) ||
                    multipleBirthsRequestDays === 0)
                )
              },
              title: parentalLeaveFormMessages.shared.transferRightsTitle,
              description:
                parentalLeaveFormMessages.shared.transferRightsDescription,
              component: 'TransferRights',
            }),
            buildMultiField({
              id: 'requestRights',
              title:
                parentalLeaveFormMessages.shared.transferRightsRequestTitle,
              condition: (answers, externalData) => {
                const { hasMultipleBirths, otherParent } =
                  getApplicationAnswers(answers)

                const canTransferRights =
                  getSelectedChild(answers, externalData)?.parentalRelation ===
                    ParentalRelations.primary &&
                  (otherParent === SPOUSE || otherParent === MANUAL)

                const multipleBirthsRequestDays =
                  getMultipleBirthRequestDays(answers)

                return (
                  canTransferRights &&
                  getApplicationAnswers(answers).isRequestingRights === YES &&
                  (hasMultipleBirths === NO ||
                    multipleBirthsRequestDays ===
                      getMaxMultipleBirthsDays(answers))
                )
              },
              children: [
                buildSliderField({
                  id: 'requestRights.requestDays',
                  label: {
                    singular: parentalLeaveFormMessages.shared.day,
                    plural: parentalLeaveFormMessages.shared.days,
                  },
                  min: 1,
                  max: maxDaysToGiveOrReceive,
                  step: 1,
                  defaultValue: 1,
                  showMinMaxLabels: true,
                  showToolTip: true,
                  trackStyle: { gridTemplateRows: 8 },
                  calculateCellStyle: () => {
                    return {
                      background: theme.color.dark200,
                    }
                  },
                  saveAsString: true,
                }),
                buildCustomField({
                  id: 'requestRights.isRequestingRights',
                  childInputIds: ['requestRights.isRequestingRights'],
                  component: 'RequestDaysBoxChart',
                }),
              ],
            }),
            buildMultiField({
              id: 'giveRights',
              title: parentalLeaveFormMessages.shared.transferRightsGiveTitle,
              condition: (answers, externalData) => {
                const canTransferRights =
                  getSelectedChild(answers, externalData)?.parentalRelation ===
                    ParentalRelations.primary && allowOtherParent(answers)

                const { hasMultipleBirths } = getApplicationAnswers(answers)

                const multipleBirthsRequestDays =
                  getMultipleBirthRequestDays(answers)

                return (
                  canTransferRights &&
                  getApplicationAnswers(answers).isGivingRights === YES &&
                  (hasMultipleBirths === NO || multipleBirthsRequestDays === 0)
                )
              },
              children: [
                buildSliderField({
                  id: 'giveRights.giveDays',
                  label: {
                    singular: parentalLeaveFormMessages.shared.day,
                    plural: parentalLeaveFormMessages.shared.days,
                  },
                  min: 1,
                  max: maxDaysToGiveOrReceive,
                  step: 1,
                  defaultValue: 1,
                  showMinMaxLabels: true,
                  showToolTip: true,
                  trackStyle: { gridTemplateRows: 8 },
                  calculateCellStyle: () => {
                    return {
                      background: theme.color.dark200,
                    }
                  },
                  saveAsString: true,
                }),
                buildCustomField({
                  id: 'giveRights.isGivingRights',
                  childInputIds: ['giveRights.isGivingRights'],
                  component: 'GiveDaysBoxChart',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'otherParentEmailQuestion',
          title: parentalLeaveFormMessages.shared.otherParentEmailSubSection,
          condition: (answers, externalData) =>
            requiresOtherParentApproval(answers, externalData),
          children: [
            buildMultiField({
              id: 'otherParentContactInfo',
              title: parentalLeaveFormMessages.shared.otherParentEmailTitle,
              children: [
                buildTextField({
                  id: 'otherParentEmail',
                  title: parentalLeaveFormMessages.applicant.email,
                  description:
                    parentalLeaveFormMessages.shared
                      .otherParentEmailDescription,
                }),
                buildTextField({
                  id: 'otherParentPhoneNumber',
                  title: parentalLeaveFormMessages.applicant.phoneNumber,
                  variant: 'tel',
                  format: '###-####',
                  placeholder: '000-0000',
                }),
              ],
            }),
          ],
        }),
        /*
        TODO: add back once payment plan is implemented
        buildSubSection({
          id: 'rightsReview',
          title: parentalLeaveFormMessages.shared.rightsSummarySubSection,
          children: [
            buildMultiField({
              id: 'reviewRights',
              title: parentalLeaveFormMessages.shared.rightsSummaryName,
              description: (application) =>
                `${formatIsk(
                  getEstimatedMonthlyPay(application),
                )} er áætluð mánaðarleg útborgun þín fyrir hvern heilan mánuð eftir skatt.`, // TODO messages
              children: [
                buildCustomField({
                  id: 'reviewRights',
                  component: 'ReviewRights',
                }),
              ],
            }),
          ],
        }),
        */
      ],
    }),
    buildSection({
      id: 'leavePeriods',
      title: getPeriodSectionTitle,
      children: [
        buildSubSection({
          id: 'addPeriods',
          title: parentalLeaveFormMessages.leavePlan.subSection,
          children: [
            buildRepeater({
              id: 'periods',
              title: getLeavePlanTitle,
              component: 'PeriodsRepeater',
              children: [
                buildCustomField({
                  id: 'firstPeriodStart',
                  title: getFirstPeriodTitle,
                  condition: (answers) => {
                    const { periods } = getApplicationAnswers(answers)

                    return periods.length === 0
                  },
                  component: 'FirstPeriodStart',
                }),
                buildDateField({
                  id: 'startDate',
                  title: getStartDateTitle,
                  description: getStartDateDesc,
                  placeholder: parentalLeaveFormMessages.startDate.placeholder,
                  defaultValue: NO_ANSWER,
                  condition: (answers) => {
                    const { periods, rawPeriods } =
                      getApplicationAnswers(answers)
                    const currentPeriod = rawPeriods[rawPeriods.length - 1]
                    const firstPeriodRequestingSpecificStartDate =
                      currentPeriod?.firstPeriodStart ===
                      StartDateOptions.SPECIFIC_DATE

                    return (
                      firstPeriodRequestingSpecificStartDate ||
                      periods.length !== 0
                    )
                  },
                  minDate: (application: Application) =>
                    getMinimumStartDate(application),
                  excludeDates: (application) => {
                    const { periods } = getApplicationAnswers(
                      application.answers,
                    )

                    return getAllPeriodDates(periods)
                  },
                }),
                buildRadioField({
                  id: 'useLength',
                  title: getDurationTitle,
                  description: parentalLeaveFormMessages.duration.description,
                  defaultValue: YES,
                  options: [
                    {
                      label: parentalLeaveFormMessages.duration.monthsOption,
                      value: YES,
                    },
                    {
                      label:
                        parentalLeaveFormMessages.duration.specificDateOption,
                      value: NO,
                    },
                  ],
                }),
                buildCustomField({
                  id: 'endDate',
                  condition: (answers) => {
                    const { rawPeriods } = getApplicationAnswers(answers)
                    const period = rawPeriods[rawPeriods.length - 1]

                    return period?.useLength === YES && !!period?.startDate
                  },
                  title: getDurationTitle,
                  component: 'Duration',
                }),
                buildCustomField(
                  {
                    id: 'endDate',
                    title: parentalLeaveFormMessages.endDate.title,
                    component: 'PeriodEndDate',
                    condition: (answers) => {
                      const { rawPeriods } = getApplicationAnswers(answers)
                      const period = rawPeriods[rawPeriods.length - 1]

                      return period?.useLength === NO && !!period?.startDate
                    },
                  },
                  {
                    minDate: getMinimumEndDate,
                    excludeDates: (application: Application) => {
                      const { periods } = getApplicationAnswers(
                        application.answers,
                      )

                      return getAllPeriodDates(periods)
                    },
                  },
                ),
                buildCustomField({
                  id: 'ratio',
                  title: getRatioTitle,
                  description: parentalLeaveFormMessages.ratio.description,
                  component: 'PeriodPercentage',
                  condition: (answers) => {
                    const { rawPeriods } = getApplicationAnswers(answers)
                    const period = rawPeriods[rawPeriods.length - 1]

                    return !!period?.startDate && !!period?.endDate
                  },
                }),
              ],
            }),
          ],
        }),

        // TODO: Bring back this feature post v1 launch
        // https://app.asana.com/0/1182378413629561/1200214178491339/f
        // buildSubSection({
        //   id: 'shareInformation',
        //   title: parentalLeaveFormMessages.shareInformation.subSection,
        //   condition: (answers) => answers.otherParent !== NO,
        //   children: [
        //     buildRadioField({
        //       id: 'shareInformationWithOtherParent',
        //       title: parentalLeaveFormMessages.shareInformation.title,
        //       description:
        //         parentalLeaveFormMessages.shareInformation.description,
        //       options: [
        //         {
        //           label: parentalLeaveFormMessages.shareInformation.yesOption,
        //           value: YES,
        //         },
        //         {
        //           label: parentalLeaveFormMessages.shareInformation.noOption,
        //           value: NO,
        //         },
        //       ],
        //     }),
        //   ],
        // }),
      ],
    }),
    buildSection({
      id: 'additionalInformation',
      title: parentalLeaveFormMessages.shared.additionalInformationSection,
      children: [
        buildSubSection({
          id: 'fileUploadSection',
          title: parentalLeaveFormMessages.attachmentScreen.title,
          children: [
            buildFileUploadField({
              id: 'fileUpload.file',
              title: parentalLeaveFormMessages.attachmentScreen.title,
              introduction:
                parentalLeaveFormMessages.attachmentScreen.description,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                parentalLeaveFormMessages.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: parentalLeaveFormMessages.fileUpload.uploadHeader,
              uploadDescription:
                parentalLeaveFormMessages.fileUpload.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.fileUpload.attachmentButton,
            }),
          ],
        }),
        buildSubSection({
          id: 'commentSection',
          title: parentalLeaveFormMessages.applicant.commentSection,
          children: [
            buildTextField({
              id: 'comment',
              title: parentalLeaveFormMessages.applicant.commentSection,
              variant: 'textarea',
              rows: 10,
              maxLength: 1024,
              description:
                parentalLeaveFormMessages.applicant.commentDescription,
              placeholder:
                parentalLeaveFormMessages.applicant.commentPlaceholder,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: parentalLeaveFormMessages.confirmation.title,
      children: [
        buildMultiField({
          id: 'confirmation',
          children: [
            buildCustomField(
              {
                id: 'confirmationScreen',
                title: '',
                component: 'Review',
              },
              {
                editable: true,
              },
            ),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: parentalLeaveFormMessages.confirmation.submitButton,
                  type: 'primary',
                  condition: (answers, externalData) => {
                    const { applicationFundId } =
                      getApplicationExternalData(externalData)
                    if (!applicationFundId || applicationFundId === '') {
                      const { periods } = getApplicationAnswers(answers)
                      return (
                        periods.length > 0 &&
                        new Date(periods[0].startDate) >=
                          addDays(getBeginningOfMonth3MonthsAgo(), -1)
                      )
                    }

                    return true
                  },
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildFormConclusionSection({
      alertType: 'success',
      alertTitle: parentalLeaveFormMessages.finalScreen.alertTitle,
      alertMessage: parentalLeaveFormMessages.finalScreen.description,
      multiFieldTitle: parentalLeaveFormMessages.finalScreen.title,
      expandableIntro: parentalLeaveFormMessages.finalScreen.expandableIntro,
      expandableDescription: (application: Application) => {
        const nextSteps = getConclusionScreenSteps(application)

        // Create a markdown from the steps translations strings
        let markdown = ''

        nextSteps.forEach((step) => {
          const translation = formatText(
            step,
            application,
            useLocale().formatMessage,
          )
          markdown += `* ${translation} \n`
        })

        return markdown
      },
    }),
  ],
})
