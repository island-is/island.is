import addDays from 'date-fns/addDays'

import {
  Application,
  buildAsyncSelectField,
  buildCustomField,
  buildDateField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildRepeater,
  buildSection,
  buildSelectField,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  Field,
  Form,
  FormModes,
  SelectField,
} from '@island.is/application/core'

import { parentalLeaveFormMessages } from '../lib/messages'
import {
  getExpectedDateOfBirth,
  getOtherParentOptions,
  getAllPeriodDates,
  getSelectedChild,
  createRange,
  requiresOtherParentApproval,
  getApplicationAnswers,
  allowOtherParent,
  getPeriodPercentage,
  getLastValidPeriodEndDate,
} from '../lib/parentalLeaveUtils'
import {
  GetPensionFunds,
  GetUnions,
  GetPrivatePensionFunds,
} from '../graphql/queries'
import {
  FILE_SIZE_LIMIT,
  MANUAL,
  NO,
  ParentalRelations,
  StartDateOptions,
  YES,
} from '../constants'
import Logo from '../assets/Logo'
import {
  defaultMonths,
  minimumPeriodStartBeforeExpectedDateOfBirth,
  minPeriodDays,
} from '../config'
import {
  GetPensionFundsQuery,
  GetPrivatePensionFundsQuery,
  GetUnionsQuery,
} from '../types/schema'

const percentOptions = createRange<{ label: string; value: string }>(
  10,
  (i) => {
    const ii = (i + 1) * 10

    return {
      label: `${ii}%`,
      value: `${ii}`,
    }
  },
).sort((a, b) => Number(b.value) - Number(a.value))

export const ParentalLeaveForm: Form = buildForm({
  id: 'ParentalLeaveDraft',
  title: parentalLeaveFormMessages.shared.formTitle,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'prerequisites',
      title: parentalLeaveFormMessages.shared.prerequisitesSection,
      children: [],
    }),
    buildSection({
      id: 'theApplicant',
      title: parentalLeaveFormMessages.shared.applicantSection,
      children: [
        buildSubSection({
          id: 'emailAndPhoneNumber',
          title: parentalLeaveFormMessages.applicant.subSection,
          children: [
            buildMultiField({
              id: 'contactInfo',
              title: parentalLeaveFormMessages.applicant.title,
              description: parentalLeaveFormMessages.applicant.description,
              children: [
                buildTextField({
                  width: 'half',
                  title: parentalLeaveFormMessages.applicant.email,
                  id: 'applicant.email',
                  variant: 'email',
                  defaultValue: (application: Application) =>
                    (application.externalData.userProfile?.data as {
                      email?: string
                    })?.email,
                }),
                buildTextField({
                  width: 'half',
                  title: parentalLeaveFormMessages.applicant.phoneNumber,
                  defaultValue: (application: Application) =>
                    (application.externalData.userProfile?.data as {
                      mobilePhoneNumber?: string
                    })?.mobilePhoneNumber,
                  id: 'applicant.phoneNumber',
                  variant: 'tel',
                  format: '###-####',
                  placeholder: '000-0000',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'otherParent',
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
              id: 'otherParent',
              title: parentalLeaveFormMessages.shared.otherParentTitle,
              description:
                parentalLeaveFormMessages.shared.otherParentDescription,
              children: [
                buildRadioField({
                  id: 'otherParent',
                  title: parentalLeaveFormMessages.shared.otherParentSubTitle,
                  options: (application) => getOtherParentOptions(application),
                }),
                buildTextField({
                  id: 'otherParentName',
                  condition: (answers) => answers.otherParent === MANUAL,
                  title: parentalLeaveFormMessages.shared.otherParentName,
                  width: 'half',
                }),
                buildTextField({
                  id: 'otherParentId',
                  condition: (answers) => answers.otherParent === MANUAL,
                  title: parentalLeaveFormMessages.shared.otherParentID,
                  width: 'half',
                  format: '######-####',
                  placeholder: '000000-0000',
                }),
              ],
            }),
            buildRadioField({
              id: 'otherParentRightOfAccess',
              condition: (answers) => answers.otherParent === MANUAL,
              title: parentalLeaveFormMessages.rightOfAccess.title,
              description: parentalLeaveFormMessages.rightOfAccess.description,
              options: [
                {
                  label: parentalLeaveFormMessages.rightOfAccess.yesOption,
                  value: YES,
                },
                {
                  label: parentalLeaveFormMessages.shared.noOptionLabel,
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
                  format: '####-##-######',
                  placeholder: '0000-00-000000',
                }),
                buildAsyncSelectField({
                  title: parentalLeaveFormMessages.shared.pensionFund,
                  id: 'payments.pensionFund',
                  loadingError: parentalLeaveFormMessages.errors.loading,
                  isSearchable: true,
                  loadOptions: async ({ apolloClient }) => {
                    const {
                      data,
                    } = await apolloClient.query<GetPensionFundsQuery>({
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
                buildAsyncSelectField({
                  title: parentalLeaveFormMessages.shared.union,
                  id: 'payments.union',
                  loadingError: parentalLeaveFormMessages.errors.loading,
                  isSearchable: true,
                  loadOptions: async ({ apolloClient }) => {
                    const { data } = await apolloClient.query<GetUnionsQuery>({
                      query: GetUnions,
                    })

                    return (
                      data?.getUnions?.map(({ id, name }) => ({
                        label: name,
                        value: id,
                      })) ?? []
                    )
                  },
                }),
                buildRadioField({
                  id: 'usePrivatePensionFund',
                  title:
                    parentalLeaveFormMessages.shared.privatePensionFundName,
                  description:
                    parentalLeaveFormMessages.shared
                      .privatePensionFundDescription,
                  width: 'half',
                  space: 4,
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
                  condition: (answers) => answers.usePrivatePensionFund === YES,
                  id: 'payments.privatePensionFund',
                  title: parentalLeaveFormMessages.shared.privatePensionFund,
                  loadingError: parentalLeaveFormMessages.errors.loading,
                  isSearchable: true,
                  loadOptions: async ({ apolloClient }) => {
                    const {
                      data,
                    } = await apolloClient.query<GetPrivatePensionFundsQuery>({
                      query: GetPrivatePensionFunds,
                    })

                    return (
                      data?.getPrivatePensionFunds?.map(({ id, name }) => ({
                        label: name,
                        value: id,
                      })) ?? []
                    )
                  },
                }),
                buildSelectField({
                  condition: (answers) => answers.usePrivatePensionFund === YES,
                  id: 'payments.privatePensionFundPercentage',
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
          condition: (answers, externalData) => {
            const selectedChild = getSelectedChild(answers, externalData)

            return selectedChild?.parentalRelation === ParentalRelations.primary
          },
          children: [
            buildRadioField({
              id: 'usePersonalAllowance',
              title: parentalLeaveFormMessages.personalAllowance.useYours,
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
            }),
            buildMultiField({
              id: 'personalAllowance',
              condition: (answers) => answers.usePersonalAllowance === YES,
              title: parentalLeaveFormMessages.personalAllowance.title,
              description:
                parentalLeaveFormMessages.personalAllowance.description,
              children: [
                buildRadioField({
                  id: 'personalAllowance.useAsMuchAsPossible',
                  title:
                    parentalLeaveFormMessages.personalAllowance
                      .useAsMuchAsPossible,
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
                }),
                buildTextField({
                  id: 'personalAllowance.usage',
                  title:
                    parentalLeaveFormMessages.personalAllowance.zeroToHundred,
                  description:
                    parentalLeaveFormMessages.personalAllowance.manual,
                  suffix: '%',
                  condition: (answers) =>
                    (answers as {
                      personalAllowance: { useAsMuchAsPossible: string }
                    })?.personalAllowance?.useAsMuchAsPossible === NO,
                  placeholder: '0%',
                  variant: 'number',
                  width: 'half',
                }),
              ],
            }),
            buildRadioField({
              id: 'usePersonalAllowanceFromSpouse',
              title: parentalLeaveFormMessages.personalAllowance.useFromSpouse,
              condition: (answers) => allowOtherParent(answers),
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
            }),
            buildMultiField({
              id: 'personalAllowanceFromSpouse',
              condition: (answers) =>
                answers.usePersonalAllowanceFromSpouse === YES,
              title: parentalLeaveFormMessages.personalAllowance.spouseTitle,
              description:
                parentalLeaveFormMessages.personalAllowance.spouseDescription,
              children: [
                buildRadioField({
                  id: 'personalAllowanceFromSpouse.useAsMuchAsPossible',
                  title:
                    parentalLeaveFormMessages.personalAllowance
                      .useAsMuchAsPossibleFromSpouse,
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
                }),
                buildTextField({
                  id: 'personalAllowanceFromSpouse.usage',
                  title:
                    parentalLeaveFormMessages.personalAllowance.zeroToHundred,
                  description:
                    parentalLeaveFormMessages.personalAllowance.manual,
                  suffix: '%',
                  condition: (answers) =>
                    (answers as {
                      personalAllowanceFromSpouse: {
                        useAsMuchAsPossible: string
                      }
                    })?.personalAllowanceFromSpouse?.useAsMuchAsPossible === NO,
                  placeholder: '0%',
                  variant: 'number',
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'employer',
          title: parentalLeaveFormMessages.employer.subSection,
          children: [
            buildRadioField({
              id: 'employer.isSelfEmployed',
              title: parentalLeaveFormMessages.selfEmployed.title,
              description: parentalLeaveFormMessages.selfEmployed.description,
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
            }),
            buildMultiField({
              id: 'employer.selfEmployed.attachment',
              title: parentalLeaveFormMessages.selfEmployed.attachmentTitle,
              description:
                parentalLeaveFormMessages.selfEmployed.attachmentDescription,
              condition: (answers) =>
                (answers as {
                  employer: {
                    isSelfEmployed: string
                  }
                })?.employer?.isSelfEmployed === YES,
              children: [
                buildFileUploadField({
                  id: 'employer.selfEmployed.file',
                  title: '',
                  introduction: '',
                  maxSize: FILE_SIZE_LIMIT,
                  uploadAccept: '.pdf',
                  uploadHeader: '',
                  uploadDescription: '',
                  uploadButtonLabel:
                    parentalLeaveFormMessages.selfEmployed.attachmentButton,
                }),
              ],
            }),
            buildMultiField({
              id: 'employer.information',
              title: parentalLeaveFormMessages.employer.title,
              description: parentalLeaveFormMessages.employer.description,
              condition: (answers) =>
                (answers as {
                  employer: {
                    isSelfEmployed: string
                  }
                })?.employer?.isSelfEmployed !== YES,
              children: [
                buildTextField({
                  title: parentalLeaveFormMessages.employer.email,
                  width: 'full',
                  id: 'employer.email',
                }),
              ],
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
              description: parentalLeaveFormMessages.shared.rightsDescription,
              children: [
                buildCustomField(
                  {
                    id: 'rightsIntro',
                    title: '',
                    component: 'BoxChart',
                  },
                  {
                    boxes: defaultMonths,
                    application: {},
                    calculateBoxStyle: () => 'blue',
                    keys: [
                      {
                        label: () => ({
                          ...parentalLeaveFormMessages.shared
                            .yourRightsInMonths,
                          values: { months: defaultMonths },
                        }),
                        bulletStyle: 'blue',
                      },
                    ],
                  },
                ),
              ],
            }),
            /*
            TODO: move back to days picker later on
            buildMultiField({
              id: 'requestRights.isRequestingRights',
              title: parentalLeaveFormMessages.shared.requestRightsName,
              description:
                parentalLeaveFormMessages.shared.requestRightsDescription,
              condition: (answers, externalData) =>
                getSelectedChild(answers, externalData)?.parentalRelation === ParentalRelations.primary,
              children: [
                buildCustomField({
                  id: 'requestRights.isRequestingRights',
                  title: '',
                  component: 'RequestRights',
                }),
                buildCustomField({
                  id: 'requestRights.requestDays',
                  title: '',
                  condition: (answers) =>
                    (answers as {
                      requestRights: {
                        isRequestingRights: string
                      }
                    })?.requestRights?.isRequestingRights === YES,
                  component: 'RequestDaysSlider',
                }),
              ],
            }),
            */
            buildCustomField({
              id: 'requestRights',
              title: parentalLeaveFormMessages.shared.requestRightsName,
              description:
                parentalLeaveFormMessages.shared.requestRightsDescription,
              width: 'half',
              condition: (answers, externalData) =>
                getSelectedChild(answers, externalData)?.parentalRelation ===
                  ParentalRelations.primary && allowOtherParent(answers),
              component: 'RequestRightsRadio',
            }),
            /*
            TODO: move back to days picker later on
            buildMultiField({
              id: 'giveRights.isGivingRights',
              title: parentalLeaveFormMessages.shared.giveRightsName,
              description:
                parentalLeaveFormMessages.shared.giveRightsDescription,
              condition: (answers, externalData) => {
                const selectedChild = getSelectedChild(answers, externalData)

                if (
                  selectedChild?.parentalRelation === ParentalRelations.secondary ||
                  !selectedChild?.hasRights ||
                  selectedChild?.remainingDays === 0
                ) {
                  return false
                }

                return (
                  (answers as {
                    requestRights: {
                      isRequestingRights: string
                    }
                  })?.requestRights?.isRequestingRights === NO
                )
              },
              children: [
                buildCustomField({
                  id: 'giveRights.isGivingRights',
                  title: '',
                  component: 'GiveRights',
                }),
                buildCustomField({
                  id: 'giveRights.giveDays',
                  title: '',
                  condition: (answers) =>
                    (answers as {
                      giveRights: {
                        isGivingRights: string
                      }
                    })?.giveRights?.isGivingRights === YES,
                  component: 'GiveDaysSlider',
                }),
              ],
            }),
            */
            buildCustomField({
              id: 'giveRights',
              title: parentalLeaveFormMessages.shared.giveRightsName,
              description:
                parentalLeaveFormMessages.shared.giveRightsDescription,
              width: 'half',
              condition: (answers, externalData) => {
                const selectedChild = getSelectedChild(answers, externalData)

                const isSecondaryParent =
                  selectedChild?.parentalRelation ===
                  ParentalRelations.secondary
                const hasNoRights = selectedChild?.hasRights === true
                const hasNoRemainingDays = selectedChild?.remainingDays === 0
                const canNotGiveRights =
                  !isSecondaryParent || hasNoRights || hasNoRemainingDays

                if (canNotGiveRights) {
                  return false
                }

                const { isRequestingRights } = getApplicationAnswers(answers)
                return isRequestingRights === NO
              },
              component: 'GiveRightsRadio',
            }),
          ],
        }),
        buildSubSection({
          id: 'otherParentEmailQuestion',
          title: parentalLeaveFormMessages.shared.otherParentEmailSubSection,
          condition: (answers) => requiresOtherParentApproval(answers),
          children: [
            buildTextField({
              id: 'otherParentEmail',
              title: parentalLeaveFormMessages.shared.otherParentEmailTitle,
              description:
                parentalLeaveFormMessages.shared.otherParentEmailDescription,
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
                  title: '',
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
      title: parentalLeaveFormMessages.shared.periodsSection,
      children: [
        buildCustomField({
          id: 'periodsImageScreen',
          title: parentalLeaveFormMessages.shared.periodsImageTitle,
          component: 'PeriodsSectionImage',
        }),
        buildSubSection({
          id: 'addPeriods',
          title: parentalLeaveFormMessages.leavePlan.subSection,
          children: [
            buildRepeater({
              id: 'periods',
              title: parentalLeaveFormMessages.leavePlan.title,
              component: 'PeriodsRepeater',
              children: [
                buildCustomField({
                  id: 'firstPeriodStart',
                  title: parentalLeaveFormMessages.firstPeriodStart.title,
                  condition: (answers) => {
                    const { periods } = getApplicationAnswers(answers)

                    return periods.length === 0
                  },
                  component: 'FirstPeriodStart',
                }),
                buildDateField({
                  id: 'startDate',
                  title: parentalLeaveFormMessages.startDate.title,
                  description: parentalLeaveFormMessages.startDate.description,
                  placeholder: parentalLeaveFormMessages.startDate.placeholder,
                  condition: (answers) => {
                    const { periods } = getApplicationAnswers(answers)

                    return periods.length !== 0
                  },
                  minDate: (application: Application) => {
                    const expectedDateOfBirth = getExpectedDateOfBirth(
                      application,
                    )

                    const lastPeriodEndDate = getLastValidPeriodEndDate(
                      application,
                    )

                    if (lastPeriodEndDate) {
                      return lastPeriodEndDate
                    } else if (expectedDateOfBirth) {
                      return addDays(
                        new Date(expectedDateOfBirth),
                        -minimumPeriodStartBeforeExpectedDateOfBirth,
                      )
                    }

                    return new Date()
                  },
                  excludeDates: (application) => {
                    const { periods } = getApplicationAnswers(
                      application.answers,
                    )

                    return getAllPeriodDates(periods)
                  },
                }),
                buildRadioField({
                  id: 'useLength',
                  title: parentalLeaveFormMessages.duration.title,
                  description: parentalLeaveFormMessages.duration.description,
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
                  id: 'endDateDuration',
                  condition: (answers) => {
                    const { rawPeriods } = getApplicationAnswers(answers)

                    return rawPeriods[rawPeriods.length - 1].useLength === YES
                  },
                  title: parentalLeaveFormMessages.duration.title,
                  component: 'Duration',
                }),
                buildCustomField(
                  {
                    id: 'endDate',
                    title: parentalLeaveFormMessages.endDate.title,
                    component: 'PeriodEndDate',
                    condition: (answers) => {
                      const { rawPeriods } = getApplicationAnswers(answers)

                      return rawPeriods[rawPeriods.length - 1].useLength === NO
                    },
                  },
                  {
                    minDate: (application: Application) => {
                      const { rawPeriods } = getApplicationAnswers(
                        application.answers,
                      )
                      const latestStartDate =
                        rawPeriods[rawPeriods.length - 1].startDate

                      return addDays(new Date(latestStartDate), minPeriodDays)
                    },
                    excludeDates: (application: Application) => {
                      const { periods } = getApplicationAnswers(
                        application.answers,
                      )

                      return getAllPeriodDates(periods)
                    },
                  },
                ),
                buildMultiField({
                  id: 'ratioContainer',
                  title: parentalLeaveFormMessages.ratio.title,
                  description: parentalLeaveFormMessages.ratio.description,
                  children: [
                    buildSelectField({
                      id: 'ratio',
                      title: parentalLeaveFormMessages.ratio.label,
                      placeholder: parentalLeaveFormMessages.ratio.placeholder,
                      defaultValue: (
                        application: Application,
                        field: SelectField,
                      ) => getPeriodPercentage(application.answers, field),
                      options: (application: Application, field: Field) => {
                        const percentage = getPeriodPercentage(
                          application.answers,
                          field,
                        )
                        const existingOptions = percentOptions.filter(
                          (option) => Number(option.value) < Number(percentage),
                        )

                        return [
                          {
                            label: `${percentage}%`,
                            value: `${percentage}`,
                          },
                          ...existingOptions,
                        ]
                      },
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // TODO: Bring back payment calculation info, once we have an api
        // app.asana.com/0/1182378413629561/1200214178491335/f
        // buildSubSection({
        //   id: 'paymentPlan',
        //   title: parentalLeaveFormMessages.paymentPlan.subSection,
        //   children: [
        //     buildCustomField(
        //       {
        //         id: 'paymentPlan',
        //         title: parentalLeaveFormMessages.paymentPlan.title,
        //         description: parentalLeaveFormMessages.paymentPlan.description,
        //         component: 'PaymentSchedule',
        //       },
        //       {},
        //     ),
        //   ],
        // }),

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
      id: 'confirmation',
      title: parentalLeaveFormMessages.confirmation.section,
      children: [
        buildMultiField({
          id: 'confirmation',
          title: parentalLeaveFormMessages.confirmation.title,
          description: parentalLeaveFormMessages.confirmation.description,
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
              title: parentalLeaveFormMessages.confirmation.title,
              actions: [
                {
                  event: 'SUBMIT',
                  name: parentalLeaveFormMessages.confirmation.title,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildCustomField({
          id: 'thankYou',
          title: parentalLeaveFormMessages.finalScreen.title,
          component: 'Conclusion',
        }),
      ],
    }),
  ],
})
