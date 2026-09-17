import {
  NO,
  YES,
  buildAlertMessageField,
  buildAsyncSelectField,
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildHiddenInput,
  buildMultiField,
  buildRadioField,
  buildRepeater,
  buildSection,
  buildSelectField,
  buildSubSection,
  buildSubmitField,
  buildTableRepeaterField,
  buildTextField,
  formatText,
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
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { useLocale } from '@island.is/localization'
import { Query } from '@island.is/api/schema'
import { maxDaysToGiveOrReceive } from '../config'
import {
  FILE_SIZE_LIMIT,
  Languages,
  MANUAL,
  NO_PRIVATE_PENSION_FUND,
  NO_UNION,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
  ParentalRelations,
  SINGLE,
  SPOUSE,
} from '../constants'
import {
  GetPensionFunds,
  GetPrivatePensionFunds,
  GetUnions,
} from '../graphql/queries'
import { parentalLeaveFormMessages } from '../lib/messages'
import {
  allowOtherParent,
  getApplicationAnswers,
  getChangeBaseline,
  getConclusionScreenSteps,
  getLeavePlanTitle,
  getMaxMultipleBirthsDays,
  getMultipleBirthRequestDays,
  getPeriodSectionTitle,
  getRightsDescTitle,
  getSelectedChild,
  getSpouse,
  normalize,
  requiresOtherParentApprovalForEdits,
} from '../lib/parentalLeaveUtils'

export const EditOrAddEmployersAndPeriods: Form = buildForm({
  id: 'ParentalLeaveEditOrAddEmployersAndPeriods',
  title: parentalLeaveFormMessages.shared.formEditTitle,
  logo: DirectorateOfLabourLogo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'confirmation',
      title: parentalLeaveFormMessages.confirmation.title,
      children: [
        buildMultiField({
          id: 'confirmation',
          children: [
            buildCustomField({
              id: 'confirmationScreen',
              component: 'EditOrAddEmployersAndPeriodsReview',
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.ABORT,
                  name: parentalLeaveFormMessages.confirmation.cancel,
                  type: 'reject',
                },
                {
                  event: DefaultEvents.SUBMIT,
                  name: parentalLeaveFormMessages.confirmation.submitButton,
                  type: 'primary',
                  // Hide the submit action only when we're confident nothing
                  // differs from the baseline — either the predecessor for a
                  // follow-up change or the snapshot taken on entry to the change
                  // form for an in-place rewind (see `snapshotRewindBaseline`).
                  // When there is no baseline we cannot detect changes, so we err
                  // on the side of letting the applicant submit rather than
                  // locking them out of the form.
                  condition: (answers, externalData) => {
                    const {
                      periods,
                      employers,
                      isSelfEmployed,
                      changeApplicationInfo,
                    } = getApplicationAnswers(answers)
                    const baseline = getChangeBaseline(externalData)

                    if (!baseline) {
                      return true
                    }

                    const periodsChanged =
                      JSON.stringify(periods) !==
                      JSON.stringify(baseline.periods)
                    const employersChanged =
                      JSON.stringify(employers) !==
                      JSON.stringify(baseline.employers)
                    const selfEmployedChanged =
                      normalize(baseline.employment.isSelfEmployed) !==
                      normalize(isSelfEmployed)

                    return (
                      periodsChanged ||
                      employersChanged ||
                      selfEmployedChanged ||
                      changeApplicationInfo === YES
                    )
                  },
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'editInfoSection',
      title: parentalLeaveFormMessages.applicant.subSection,
      children: [
        buildMultiField({
          id: 'editInfoSection',
          title: parentalLeaveFormMessages.applicant.subSection,
          children: [
            buildCustomField({
              id: 'changeApplicationInfo',
              component: 'ChangeApplicationInfoFlag',
            }),
            buildTextField({
              width: 'half',
              title: parentalLeaveFormMessages.applicant.email,
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

                return formatPhoneNumber(removeCountryCode(phoneNumber ?? ''))
              },
              id: 'applicant.phoneNumber',
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
        buildMultiField({
          id: 'redirectAfterEditInfo',
          children: [
            buildCustomField({
              id: 'navigateToConfirmationAfterInfo',
              component: 'NavigateToConfirmation',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'editOtherParentSection',
      title: parentalLeaveFormMessages.shared.otherParentSubSection,
      children: [
        buildMultiField({
          id: 'editOtherParentSpouse',
          condition: (_, externalData) => {
            const application = { externalData } as Application
            const spouse = getSpouse(application)
            return !!spouse
          },
          title: parentalLeaveFormMessages.shared.otherParentTitle,
          description: parentalLeaveFormMessages.shared.otherParentSpouse,
          children: [
            buildCustomField({
              id: 'changeApplicationInfo',
              component: 'ChangeApplicationInfoFlag',
            }),
            buildTextField({
              id: 'otherParentSpouse.otherParentName',
              dataTestId: 'other-parent-name',
              title: parentalLeaveFormMessages.shared.otherParentName,
              width: 'half',
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
              defaultValue: (application: Application) => {
                const spouse = getSpouse(application)
                return spouse?.nationalId
              },
            }),
          ],
        }),
        buildMultiField({
          id: 'editOtherParent',
          condition: (_, externalData) => {
            const application = { externalData } as Application
            const spouse = getSpouse(application)
            return !spouse
          },
          title: parentalLeaveFormMessages.shared.otherParentTitle,
          description: parentalLeaveFormMessages.shared.otherParentDescription,
          children: [
            buildCustomField({
              id: 'changeApplicationInfo',
              component: 'ChangeApplicationInfoFlag',
            }),
            buildHiddenInput({
              id: 'otherParentObj.chooseOtherParent',
              defaultValue: MANUAL,
            }),
            buildTextField({
              id: 'otherParentObj.otherParentName',
              dataTestId: 'other-parent-name',
              title: parentalLeaveFormMessages.shared.otherParentName,
              width: 'half',
            }),
            buildTextField({
              id: 'otherParentObj.otherParentId',
              dataTestId: 'other-parent-kennitala',
              title: parentalLeaveFormMessages.shared.otherParentID,
              width: 'half',
              format: '######-####',
              placeholder: '000000-0000',
            }),
          ],
        }),
        buildRadioField({
          id: 'otherParentRightOfAccess',
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
        buildMultiField({
          id: 'redirectAfterEditOtherParent',
          children: [
            buildCustomField({
              id: 'navigateToConfirmationAfterOtherParent',
              component: 'NavigateToConfirmation',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'editOtherParentContactSection',
      title: parentalLeaveFormMessages.shared.otherParentEmailSubSection,
      condition: (answers, externalData) =>
        requiresOtherParentApprovalForEdits(answers, externalData),
      children: [
        buildMultiField({
          id: 'editOtherParentContactInfo',
          title: parentalLeaveFormMessages.shared.otherParentEmailTitle,
          children: [
            buildTextField({
              id: 'otherParentEmail',
              title: parentalLeaveFormMessages.applicant.email,
              description:
                parentalLeaveFormMessages.shared.otherParentEmailDescription,
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
        buildMultiField({
          id: 'redirectAfterEditOtherParentContact',
          children: [
            buildCustomField({
              id: 'navigateToConfirmationAfterOtherParentContact',
              component: 'NavigateToConfirmation',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'editPaymentsSection',
      title: parentalLeaveFormMessages.shared.paymentInformationSubSection,
      children: [
        buildMultiField({
          title: parentalLeaveFormMessages.shared.paymentInformationName,
          id: 'editPayments',
          children: [
            buildCustomField({
              id: 'changeApplicationInfo',
              component: 'ChangeApplicationInfoFlag',
            }),
            buildTextField({
              title: parentalLeaveFormMessages.shared.paymentInformationBank,
              id: 'payments.bank',
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
              placeholder:
                parentalLeaveFormMessages.shared.asyncSelectSearchableHint,
              loadOptions: async ({ apolloClient }) => {
                const { data } = await apolloClient.query<Query>({
                  query: GetPensionFunds,
                })

                return (
                  data?.getPensionFunds?.map(({ id, name }) => ({
                    label: name,
                    value: id,
                  })) ?? []
                )
              },
            }),
            buildRadioField({
              id: 'payments.useUnion',
              title: parentalLeaveFormMessages.shared.unionName,
              description: parentalLeaveFormMessages.shared.unionDescription,
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
                  value: YES,
                },
                {
                  label: parentalLeaveFormMessages.shared.noOptionLabel,
                  value: NO,
                },
              ],
            }),
            buildAsyncSelectField({
              condition: (answers) => {
                const { applicationType, useUnion } =
                  getApplicationAnswers(answers)
                return applicationType === PARENTAL_LEAVE && useUnion === YES
              },
              title: parentalLeaveFormMessages.shared.union,
              id: 'payments.union',
              loadingError: parentalLeaveFormMessages.errors.loading,
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
              title: parentalLeaveFormMessages.shared.privatePensionFundName,
              description:
                parentalLeaveFormMessages.shared.privatePensionFundDescription,
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
                  value: YES,
                },
                {
                  label: parentalLeaveFormMessages.shared.noOptionLabel,
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
              title: parentalLeaveFormMessages.shared.privatePensionFundRatio,
              options: [
                { label: '2%', value: '2' },
                { label: '4%', value: '4' },
              ],
            }),
          ],
        }),
        buildMultiField({
          id: 'redirectAfterEditPayments',
          children: [
            buildCustomField({
              id: 'navigateToConfirmationAfterPayments',
              component: 'NavigateToConfirmation',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'editPersonalAllowanceSection',
      title: parentalLeaveFormMessages.personalAllowance.editTitle,
      children: [
        buildMultiField({
          id: 'editPersonalAllowance',
          title: parentalLeaveFormMessages.personalAllowance.editTitle,
          description:
            parentalLeaveFormMessages.personalAllowance.editDescription,
          children: [
            buildCustomField({
              id: 'changeApplicationInfo',
              component: 'ChangeApplicationInfoFlag',
            }),
            buildDescriptionField({
              id: 'personalAllowance.usageSubtitle',
              title: parentalLeaveFormMessages.personalAllowance.usageSubtitle,
              titleVariant: 'h4',
              condition: (answers) => {
                const doNotUse =
                  (
                    answers as {
                      personalAllowance: {
                        doNotUsePersonalAllowance: string[]
                      }
                    }
                  )?.personalAllowance?.doNotUsePersonalAllowance ?? []
                return !doNotUse.includes(YES)
              },
            }),
            buildTextField({
              id: 'personalAllowance.usage',
              title: parentalLeaveFormMessages.personalAllowance.oneToHundred,
              placeholder: '50%',
              backgroundColor: 'white',
              variant: 'number',
              suffix: '%',
              maxLength: 4,
              required: true,
              condition: (answers) => {
                const doNotUse =
                  (
                    answers as {
                      personalAllowance: {
                        doNotUsePersonalAllowance: string[]
                      }
                    }
                  )?.personalAllowance?.doNotUsePersonalAllowance ?? []
                return !doNotUse.includes(YES)
              },
              setOnChange: async () => [
                { key: 'personalAllowance.usePersonalAllowance', value: YES },
                { key: 'personalAllowance.useAsMuchAsPossible', value: NO },
              ],
            }),
            buildCheckboxField({
              id: 'personalAllowance.doNotUsePersonalAllowance',
              title: '',
              large: false,
              backgroundColor: 'white',
              options: [
                {
                  label:
                    parentalLeaveFormMessages.personalAllowance
                      .doNotUseCheckbox,
                  value: YES,
                },
              ],
              setOnChange: async (values) => {
                const doNotUse = Array.isArray(values) && values.includes(YES)
                return [
                  {
                    key: 'personalAllowance.usePersonalAllowance',
                    value: doNotUse ? NO : YES,
                  },
                  {
                    key: 'personalAllowance.useAsMuchAsPossible',
                    value: NO,
                  },
                ]
              },
            }),
            buildAlertMessageField({
              id: 'personalAllowance.editAlertMessage',
              title: parentalLeaveFormMessages.personalAllowance.editAlertTitle,
              message:
                parentalLeaveFormMessages.personalAllowance
                  .editAlertDescription,
              doesNotRequireAnswer: true,
              alertType: 'info',
            }),
          ],
        }),
        buildMultiField({
          id: 'redirectAfterEditPersonalAllowance',
          children: [
            buildCustomField({
              id: 'navigateToConfirmationAfterPersonalAllowance',
              component: 'NavigateToConfirmation',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'editRightsSection',
      title: parentalLeaveFormMessages.shared.rightsSection,
      children: [
        buildMultiField({
          id: 'editRightsIntro',
          title: parentalLeaveFormMessages.shared.theseAreYourRights,
          description: getRightsDescTitle,
          children: [
            buildCustomField({
              id: 'changeApplicationInfo',
              component: 'ChangeApplicationInfoFlag',
            }),
            buildCustomField({
              id: 'rightsIntro',
              doesNotRequireAnswer: true,
              component: 'Rights',
            }),
          ],
        }),
        buildMultiField({
          id: 'editMultipleBirthsRequestDays',
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
            buildCustomField({
              id: 'multipleBirthsRequestDays',
              childInputIds: [
                'multipleBirthsRequestDays',
                'requestRights.isRequestingRights',
                'requestRights.requestDays',
                'giveRights.isGivingRights',
                'giveRights.giveDays',
              ],
              component: 'MultipleBirthsDaysInput',
            }),
          ],
        }),
        buildCustomField({
          id: 'editTransferRights',
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
          id: 'editRequestRights',
          title: parentalLeaveFormMessages.shared.transferRightsRequestTitle,
          description: (_application) => ({
            ...parentalLeaveFormMessages.shared.requestDaysInputDescription,
            values: { maxDays: maxDaysToGiveOrReceive },
          }),
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
                multipleBirthsRequestDays === getMaxMultipleBirthsDays(answers))
            )
          },
          children: [
            buildCustomField({
              id: 'requestRights.isRequestingRights',
              childInputIds: [
                'requestRights.isRequestingRights',
                'requestRights.requestDays',
              ],
              component: 'RequestDaysInput',
            }),
          ],
        }),
        buildMultiField({
          id: 'editGiveRights',
          title: parentalLeaveFormMessages.shared.transferRightsGiveTitle,
          description: (_application) => ({
            ...parentalLeaveFormMessages.shared.giveDaysInputDescription,
            values: { maxDays: maxDaysToGiveOrReceive },
          }),
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
            buildCustomField({
              id: 'giveRights.isGivingRights',
              childInputIds: [
                'giveRights.isGivingRights',
                'giveRights.giveDays',
              ],
              component: 'GiveDaysInput',
            }),
          ],
        }),
        buildMultiField({
          id: 'redirectAfterEditRights',
          children: [
            buildCustomField({
              id: 'navigateToConfirmationAfterRights',
              component: 'NavigateToConfirmation',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'editOrAddPeriods',
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
                buildMultiField({
                  id: 'periodDateAndRatio',
                  title: parentalLeaveFormMessages.dateRange.title,
                  description: parentalLeaveFormMessages.dateRange.description,
                  isPartOfRepeater: true,
                  children: [
                    buildCustomField({
                      id: 'dateRange',
                      title: parentalLeaveFormMessages.dateRange.title,
                      component: 'PeriodDateRange',
                      width: 'half',
                    }),
                    buildCustomField({
                      id: 'ratio',
                      title: parentalLeaveFormMessages.ratio.title,
                      component: 'PeriodPercentage',
                      width: 'half',
                    }),
                    buildCustomField({
                      id: 'ratioWarning',
                      title: '',
                      component: 'PeriodRatioWarning',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'editOrAddEmployers',
      title: parentalLeaveFormMessages.shared.employerSection,
      condition: (answers) => {
        const {
          applicationType,
          isReceivingUnemploymentBenefits,
          employerLastSixMonths,
        } = getApplicationAnswers(answers)

        return (
          (applicationType === PARENTAL_LEAVE &&
            isReceivingUnemploymentBenefits !== YES) ||
          ((applicationType === PARENTAL_GRANT ||
            applicationType === PARENTAL_GRANT_STUDENTS) &&
            employerLastSixMonths === YES)
        )
      },
      children: [
        buildSubSection({
          id: 'editEmployers',
          title: parentalLeaveFormMessages.shared.employerSubSection,
          children: [
            buildMultiField({
              id: 'redirectBeforeEditEmployers',
              children: [
                buildCustomField({
                  id: 'navigateToConfirmationBeforeEmployers',
                  component: 'NavigateToConfirmation',
                }),
              ],
            }),
            buildMultiField({
              id: 'editEmployersFields',
              title: parentalLeaveFormMessages.employer.title,
              description: (application) => {
                const { employerLastSixMonths } = getApplicationAnswers(
                  application.answers,
                )
                return employerLastSixMonths === YES
                  ? parentalLeaveFormMessages.employer.grantsDescription
                  : parentalLeaveFormMessages.employer.description
              },
              children: [
                buildCheckboxField({
                  id: 'selfEmployedCheckbox',
                  title: '',
                  large: false,
                  backgroundColor: 'white',
                  defaultValue: (application: Application) => {
                    const { isSelfEmployed } = getApplicationAnswers(
                      application.answers,
                    )
                    return isSelfEmployed === YES ? [YES] : []
                  },
                  options: [
                    {
                      label: parentalLeaveFormMessages.selfEmployed.title,
                      value: YES,
                    },
                  ],
                  setOnChange: async (values) => {
                    const selfEmployed =
                      Array.isArray(values) && values.includes(YES)
                    const changes: { key: string; value: unknown }[] = [
                      {
                        key: 'employment.isSelfEmployed',
                        value: selfEmployed ? YES : NO,
                      },
                    ]
                    if (selfEmployed) {
                      // Clear field array entries individually since setValue on
                      // the parent path doesn't reset useFieldArray state.
                      for (let i = 0; i < 10; i++) {
                        changes.push({ key: `employers.${i}.email`, value: '' })
                        changes.push({
                          key: `employers.${i}.phoneNumber`,
                          value: '',
                        })
                        changes.push({ key: `employers.${i}.ratio`, value: '' })
                        changes.push({
                          key: `employers.${i}.stillEmployed`,
                          value: '',
                        })
                      }
                      changes.push({ key: 'employers', value: undefined })
                    } else {
                      // Applicant is on the employer-registration screen, so they
                      // are not on unemployment benefits. Original submissions from
                      // self-employed applicants never answered this, so without a
                      // default the schema refine rejects submit here.
                      changes.push({
                        key: 'employment.isReceivingUnemploymentBenefits',
                        value: NO,
                      })
                    }
                    return changes
                  },
                }),
                buildTableRepeaterField({
                  id: 'employers',
                  condition: (answers) => {
                    const { isSelfEmployed } = getApplicationAnswers(answers)
                    return isSelfEmployed !== YES
                  },
                  formTitle: parentalLeaveFormMessages.employer.registration,
                  addItemButtonText:
                    parentalLeaveFormMessages.employer.addEmployer,
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
                      component: 'input',
                      label: parentalLeaveFormMessages.employer.ratio,
                      placeholder:
                        parentalLeaveFormMessages.employer.ratioPlaceholder,
                      dataTestId: 'employment-ratio',
                      type: 'number',
                      suffix: '%',
                      min: 0,
                      max: 100,
                      maxLength: 3,
                    },
                    stillEmployed: {
                      component: 'radio',
                      label: parentalLeaveFormMessages.employer.stillEmployed,
                      width: 'half',
                      options: [
                        {
                          value: YES,
                          label:
                            parentalLeaveFormMessages.shared.yesOptionLabel,
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
          ],
        }),
        buildSubSection({
          id: 'reviewUpload',
          title: parentalLeaveFormMessages.fileUpload.additionalAttachmentTitle,
          children: [
            buildFileUploadField({
              id: 'fileUpload.changeEmployerFile',
              title:
                parentalLeaveFormMessages.fileUpload.additionalAttachmentTitle,
              introduction:
                parentalLeaveFormMessages.fileUpload
                  .additionalAttachmentDescription,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                parentalLeaveFormMessages.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: '',
              uploadDescription:
                parentalLeaveFormMessages.fileUpload.uploadDescription,
              uploadButtonLabel:
                parentalLeaveFormMessages.fileUpload.attachmentButton,
              uploadMultiple: true,
            }),
          ],
        }),
        buildMultiField({
          id: 'redirectAfterEditEmployers',
          children: [
            buildCustomField({
              id: 'navigateToConfirmationAfterEmployers',
              component: 'NavigateToConfirmation',
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
      expandableHeader: parentalLeaveFormMessages.finalScreen.title,
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
