import {
  Application,
  buildAsyncSelectField,
  buildCustomField,
  buildDataProviderItem,
  buildDateField,
  buildExternalDataProvider,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildRepeater,
  buildSection,
  buildSelectField,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m, mm } from '../lib/messages'
import { formatIsk, getEstimatedMonthlyPay } from '../fields/parentalLeaveUtils'
import { GetPensionFunds, GetUnions } from '../graphql/queries'
import { NO, YES } from '../constants'

import Logo from '../assets/Logo'

interface SelectItem {
  id: string
  name: string
}

type UnionQuery = {
  getUnions: Array<SelectItem>
}

type PensionFundsQuery = {
  getPensionFunds: Array<SelectItem>
}

export const ParentalLeaveForm: Form = buildForm({
  id: 'ParentalLeaveDraft',
  title: 'Fæðingarorlof',
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'theApplicant',
      title: m.applicantSection,
      children: [
        buildSubSection({
          id: 'externalData',
          title: m.externalDataSubSection,
          children: [
            buildExternalDataProvider({
              title: m.introductionProvider,
              id: 'approveExternalData',
              dataProviders: [
                buildDataProviderItem({
                  id: 'userProfile',
                  type: 'UserProfileProvider',
                  title: m.userProfileInformationTitle,
                  subTitle: m.userProfileInformationSubTitle,
                }),
                buildDataProviderItem({
                  id: 'pregnancyStatus',
                  type: 'PregnancyStatus',
                  title: m.expectedDateOfBirthTitle,
                  subTitle: m.expectedDateOfBirthSubtitle,
                }),
                buildDataProviderItem({
                  id: 'parentalLeaves',
                  type: 'ParentalLeaves',
                  title: m.existingParentalLeavesTitle,
                  subTitle: m.existingParentalLeavesSubTitle,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'emailAndPhoneNumber',
          title: mm.applicant.subSection,
          children: [
            buildMultiField({
              id: 'contactInfo',
              title: mm.applicant.title,
              description: mm.applicant.description,
              children: [
                buildTextField({
                  width: 'half',
                  title: mm.applicant.email,
                  id: 'applicant.email',
                  variant: 'email',
                  defaultValue: (application: Application) =>
                    (application.externalData.userProfile?.data as {
                      email?: string
                    })?.email,
                }),
                buildTextField({
                  width: 'half',
                  title: mm.applicant.phoneNumber,
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
          title: m.otherParentSubSection,
          children: [
            buildMultiField({
              id: 'otherParent',
              title: m.otherParentTitle,
              description: m.otherParentDescription,
              condition: () => {
                // TODO this screen is only for the primary parent
                return true
              },
              children: [
                buildCustomField({
                  id: 'otherParent',
                  title: '',
                  component: 'OtherParent',
                }),
                buildTextField({
                  id: 'otherParentName',
                  condition: (answers) => answers.otherParent === 'manual',
                  title: m.otherParentName,
                  width: 'half',
                }),
                buildTextField({
                  id: 'otherParentId',
                  condition: (answers) => answers.otherParent === 'manual',
                  title: m.otherParentID,
                  width: 'half',
                  format: '######-####',
                  placeholder: '000000-0000',
                }),
              ],
            }),
            buildRadioField({
              id: 'otherParentRightOfAccess',
              largeButtons: true,
              emphasize: true,
              condition: (answers) => answers.otherParent === 'manual',
              title: mm.rightOfAccess.title,
              description: mm.rightOfAccess.description,
              options: [
                { label: mm.rightOfAccess.yesOption, value: YES },
                { label: m.noOptionLabel, value: NO },
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'payments',
          title: m.paymentInformationSubSection,
          children: [
            buildMultiField({
              title: m.paymentInformationName,
              id: 'payments',
              children: [
                buildTextField({
                  title: m.paymentInformationBank,
                  id: 'payments.bank',
                  format: '####-##-######',
                  placeholder: '0000-00-000000',
                }),
                buildAsyncSelectField({
                  title: m.pensionFund,
                  id: 'payments.pensionFund',
                  width: 'half',
                  loadOptions: async ({ apolloClient }) => {
                    const { data } = await apolloClient.query<
                      PensionFundsQuery
                    >({
                      query: GetPensionFunds,
                    })

                    return (
                      data?.getPensionFunds.map(({ id, name }) => ({
                        label: name,
                        value: id,
                      })) ?? []
                    )
                  },
                }),
                buildAsyncSelectField({
                  title: m.union,
                  id: 'payments.union',
                  width: 'half',
                  loadingError: mm.errors.loading,
                  loadOptions: async ({ apolloClient }) => {
                    const { data } = await apolloClient.query<UnionQuery>({
                      query: GetUnions,
                    })

                    return (
                      data?.getUnions.map(({ id, name }) => ({
                        label: name,
                        value: id,
                      })) ?? []
                    )
                  },
                }),
                buildRadioField({
                  emphasize: true,
                  largeButtons: false,
                  id: 'usePrivatePensionFund',
                  title: m.privatePensionFundName,
                  description: m.privatePensionFundDescription,
                  options: [
                    { label: m.yesOptionLabel, value: YES },
                    { label: m.noOptionLabel, value: NO },
                  ],
                }),
                buildSelectField({
                  condition: (answers) => answers.usePrivatePensionFund === YES,
                  id: 'payments.privatePensionFund',
                  title: m.privatePensionFund,
                  width: 'half',
                  options: [{ label: 'Frjalsi', value: 'frjalsi' }],
                }),
                buildSelectField({
                  condition: (answers) => answers.usePrivatePensionFund === YES,
                  id: 'payments.privatePensionFundPercentage',
                  title: m.privatePensionFundRatio,
                  width: 'half',
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
          title: mm.personalAllowance.title,
          children: [
            buildRadioField({
              id: 'usePersonalAllowance',
              title: mm.personalAllowance.useYours,
              largeButtons: true,
              width: 'half',
              options: [
                { label: m.yesOptionLabel, value: YES },
                { label: m.noOptionLabel, value: NO },
              ],
            }),
            buildMultiField({
              id: 'personalAllowance',
              condition: (answers) => answers.usePersonalAllowance === YES,
              title: mm.personalAllowance.title,
              description: mm.personalAllowance.description,
              children: [
                buildRadioField({
                  id: 'personalAllowance.useAsMuchAsPossible',
                  title: mm.personalAllowance.useAsMuchAsPossible,
                  width: 'half',
                  largeButtons: true,
                  options: [
                    { label: m.yesOptionLabel, value: YES },
                    { label: m.noOptionLabel, value: NO },
                  ],
                }),
                buildTextField({
                  id: 'personalAllowance.usage',
                  title: mm.personalAllowance.zeroToHundred,
                  description: mm.personalAllowance.manual,
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
              title: mm.personalAllowance.useFromSpouse,
              condition: (answers) => {
                // TODO add check if this person has a spouse...
                return true
              },
              largeButtons: true,
              width: 'half',
              options: [
                { label: m.yesOptionLabel, value: YES },
                { label: m.noOptionLabel, value: NO },
              ],
            }),
            buildMultiField({
              id: 'personalAllowanceFromSpouse',
              condition: (answers) =>
                answers.usePersonalAllowanceFromSpouse === YES,
              title: mm.personalAllowance.spouseTitle,
              description: mm.personalAllowance.spouseDescription,
              children: [
                buildRadioField({
                  id: 'personalAllowanceFromSpouse.useAsMuchAsPossible',
                  title: mm.personalAllowance.useAsMuchAsPossible,
                  width: 'half',
                  largeButtons: true,
                  options: [
                    { label: m.yesOptionLabel, value: YES },
                    { label: m.noOptionLabel, value: NO },
                  ],
                }),
                buildTextField({
                  id: 'personalAllowanceFromSpouse.usage',
                  title: mm.personalAllowance.zeroToHundred,
                  description: mm.personalAllowance.manual,
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
          title: mm.employer.subSection,
          children: [
            buildRadioField({
              id: 'employer.isSelfEmployed',
              title: mm.selfEmployed.title,
              description: mm.selfEmployed.description,
              largeButtons: true,
              width: 'half',
              options: [
                { label: m.yesOptionLabel, value: YES },
                { label: m.noOptionLabel, value: NO },
              ],
            }),
            buildMultiField({
              id: 'employer',
              title: mm.employer.title,
              description: mm.employer.description,
              condition: (answers) =>
                (answers as {
                  employer: {
                    isSelfEmployed: string
                  }
                })?.employer?.isSelfEmployed !== YES,
              children: [
                buildTextField({
                  title: mm.employer.email,
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
      title: m.rightsSection,
      children: [
        buildSubSection({
          id: 'rightsQuestions',
          title: m.yourRights,
          children: [
            buildMultiField({
              id: 'rightsIntro',
              title: m.theseAreYourRights,
              description: m.rightsDescription,
              children: [
                buildCustomField(
                  {
                    id: 'rightsIntro',
                    title: '',
                    component: 'BoxChart',
                  },
                  {
                    boxes: 6,
                    application: {},
                    calculateBoxStyle: () => 'blue',
                    keys: [
                      {
                        label: () => ({
                          ...m.yourRightsInMonths,
                          values: { months: '6' },
                        }),
                        bulletStyle: 'blue',
                      },
                    ],
                  },
                ),
              ],
            }),
            buildMultiField({
              id: 'requestRights.isRequestingRights',
              title: m.requestRightsName,
              description: m.requestRightsDescription,
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
            buildMultiField({
              id: 'giveRights.isGivingRights',
              title: m.giveRightsName,
              description: m.giveRightsDescription,
              condition: (answers) =>
                (answers as {
                  requestRights: {
                    isRequestingRights: string
                  }
                })?.requestRights?.isRequestingRights === NO,

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
          ],
        }),
        buildSubSection({
          id: 'rightsReview',
          title: m.rightsSummarySubSection,
          children: [
            buildMultiField({
              id: 'reviewRights',
              title: m.rightsSummaryName,
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
      ],
    }),
    buildSection({
      id: 'leavePeriods',
      title: m.periodsSection,
      children: [
        buildCustomField({
          id: 'periodsImageScreen',
          title: m.periodsImageTitle,
          component: 'PeriodsSectionImage',
        }),
        buildSubSection({
          id: 'firstPeriod',
          title: m.firstPeriodName,
          children: [
            buildRadioField({
              id: 'singlePeriod',
              title: m.periodAllAtOnce,
              description: m.periodAllAtOnceDescription,
              largeButtons: true,
              options: [
                {
                  label: m.periodAllAtOnceYes,
                  value: YES,
                },
                {
                  label: m.periodAllAtOnceNo,
                  value: NO,
                },
              ],
            }),
            buildCustomField({
              id: 'firstPeriodStart',
              title: mm.firstPeriodStart.title,
              component: 'FirstPeriodStart',
            }),
            buildMultiField({
              id: 'startDate',
              condition: (formValue) =>
                formValue.firstPeriodStart === 'specificDate',
              title: mm.startDate.title,
              description: mm.startDate.description,
              children: [
                buildDateField({
                  id: 'periods[0].startDate',
                  width: 'half',
                  title: mm.startDate.label,
                  placeholder: mm.startDate.placeholder,
                }),
              ],
            }),
            buildRadioField({
              id: 'confirmLeaveDuration',
              title: mm.duration.title,
              description: mm.duration.description,
              largeButtons: true,
              options: [
                { label: mm.duration.monthsOption, value: 'duration' },
                {
                  label: mm.duration.specificDateOption,
                  value: 'specificDate',
                },
              ],
            }),
            buildMultiField({
              id: 'endDate',
              condition: (formValue) =>
                formValue.confirmLeaveDuration === 'specificDate',
              title: mm.endDate.title,
              description: mm.endDate.description,
              children: [
                buildDateField({
                  id: 'periods[0].endDate',
                  width: 'half',
                  title: mm.endDate.label,
                  placeholder: mm.endDate.placeholder,
                }),
              ],
            }),
            buildCustomField(
              {
                id: 'periods[0].endDate',
                condition: (formValue) =>
                  formValue.confirmLeaveDuration === 'duration',
                title: mm.duration.title,
                component: 'ParentalLeaveDuration',
              },
              {},
            ),
            buildMultiField({
              id: 'periods[0].ratio',
              title: mm.ratio.title,
              description: mm.ratio.description,
              children: [
                buildSelectField({
                  id: 'periods[0].ratio',
                  width: 'half',
                  title: mm.ratio.label,
                  placeholder: mm.ratio.placeholder,
                  defaultValue: '100',
                  options: [
                    { label: '100%', value: '100' },
                    { label: '75%', value: '75' },
                    { label: '50%', value: '50' },
                    { label: '25%', value: '25' },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'addMorePeriods',
          title: mm.leavePlan.subSection,
          children: [
            buildRepeater({
              id: 'periods',
              title: mm.leavePlan.title,
              component: 'PeriodsRepeater',
              children: [
                buildDateField({
                  id: 'startDate',
                  title: mm.startDate.title,
                  description: mm.startDate.description,
                  placeholder: mm.startDate.placeholder,
                }),
                buildMultiField({
                  id: 'endDate',
                  title: mm.endDate.title,
                  description: mm.endDate.description,
                  children: [
                    buildDateField({
                      id: 'endDate',
                      title: mm.endDate.label,
                      placeholder: mm.endDate.placeholder,
                    }),
                  ],
                }),
                // buildCustomField(
                //   {
                //     id: 'endDate',
                //     name: m.duration,
                //     description: mm.duration.description,
                //     component: 'ParentalLeaveDuration',
                //   },
                //   {
                //     showTimeline: true,
                //   },
                // ),
                buildMultiField({
                  id: 'ratio',
                  title: mm.ratio.title,
                  description: mm.ratio.description,
                  children: [
                    buildSelectField({
                      id: 'ratio',
                      width: 'half',
                      title: mm.ratio.label,
                      defaultValue: '100',
                      placeholder: mm.ratio.placeholder,
                      options: [
                        { label: '100%', value: '100' },
                        { label: '75%', value: '75' },
                        { label: '50%', value: '50' },
                        { label: '25%', value: '25' },
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'paymentPlan',
          title: mm.paymentPlan.subSection,
          children: [
            buildCustomField(
              {
                id: 'paymentPlan',
                title: mm.paymentPlan.title,
                description: mm.paymentPlan.description,
                component: 'PaymentSchedule',
              },
              {},
            ),
          ],
        }),
        buildSubSection({
          id: 'shareInformation',
          title: mm.shareInformation.subSection,
          children: [
            buildRadioField({
              id: 'shareInformationWithOtherParent',
              title: mm.shareInformation.title,
              description: mm.shareInformation.description,
              emphasize: false,
              largeButtons: true,
              options: [
                {
                  label: mm.shareInformation.yesOption,
                  value: YES,
                },
                {
                  label: mm.shareInformation.noOption,
                  value: NO,
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: mm.confirmation.section,
      children: [
        buildMultiField({
          id: 'confirmation',
          title: mm.confirmation.title,
          description: mm.confirmation.description,
          children: [
            buildCustomField({
              id: 'confirmationScreen',
              title: '',
              component: 'Review',
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: mm.confirmation.title,

              actions: [
                {
                  event: 'SUBMIT',
                  name: mm.confirmation.title,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'thankYou',
          title: mm.finalScreen.title,
          description: mm.finalScreen.description,
        }),
      ],
    }),
  ],
})
