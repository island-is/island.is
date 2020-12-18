import {
  Application,
  buildAsyncSelectField,
  buildCustomField,
  buildDataProviderItem,
  buildDateField,
  buildExternalDataProvider,
  buildForm,
  buildIntroductionField,
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
  Option,
} from '@island.is/application/core'
import { m, mm } from '../lib/messages'
import {
  formatIsk,
  getEstimatedMonthlyPay,
  getNameAndIdOfSpouse,
} from '../fields/parentalLeaveUtils'
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
  name: 'Fæðingarorlof',
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'theApplicant',
      name: m.applicantSection,
      children: [
        buildSubSection({
          id: 'externalData',
          name: m.externalDataSubSection,
          children: [
            buildExternalDataProvider({
              name: m.introductionProvider,
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
          name: mm.applicant.subSection,
          children: [
            buildMultiField({
              id: 'contactInfo',
              name: mm.applicant.title,
              description: mm.applicant.description,
              children: [
                buildTextField({
                  width: 'half',
                  name: mm.applicant.email,
                  id: 'applicant.email',
                  variant: 'email',
                  defaultValue: (application: Application) =>
                    (application.externalData.userProfile?.data as {
                      email?: string
                    })?.email,
                }),
                buildTextField({
                  width: 'half',
                  name: mm.applicant.phoneNumber,
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
          name: m.otherParentSubSection,
          children: [
            buildMultiField({
              id: 'otherParent',
              name: m.otherParentTitle,
              description: m.otherParentDescription,
              condition: () => {
                // TODO this screen is only for the primary parent
                return true
              },
              children: [
                buildCustomField({
                  id: 'otherParent',
                  name: '',
                  component: 'OtherParent',
                }),
                buildTextField({
                  id: 'otherParentName',
                  condition: (answers) => answers.otherParent === 'manual',
                  name: m.otherParentName,
                  width: 'half',
                }),
                buildTextField({
                  id: 'otherParentId',
                  condition: (answers) => answers.otherParent === 'manual',
                  name: m.otherParentID,
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
              name: mm.rightOfAccess.title,
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
          name: m.paymentInformationSubSection,
          children: [
            buildMultiField({
              name: m.paymentInformationName,
              id: 'payments',
              children: [
                buildTextField({
                  name: m.paymentInformationBank,
                  id: 'payments.bank',
                  width: 'half',
                  format: '####-##-######',
                  placeholder: '0000-00-000000',
                }),
                buildAsyncSelectField({
                  name: m.pensionFund,
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
                  name: m.union,
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
                  name: m.privatePensionFundName,
                  description: m.privatePensionFundDescription,
                  options: [
                    { label: m.yesOptionLabel, value: YES },
                    { label: m.noOptionLabel, value: NO },
                  ],
                }),
                buildSelectField({
                  condition: (answers) => answers.usePrivatePensionFund === YES,
                  id: 'payments.privatePensionFund',
                  name: m.privatePensionFund,
                  width: 'half',
                  options: [{ label: 'Frjalsi', value: 'frjalsi' }],
                }),
                buildSelectField({
                  condition: (answers) => answers.usePrivatePensionFund === YES,
                  id: 'payments.privatePensionFundPercentage',
                  name: m.privatePensionFundRatio,
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
          name: m.personalAllowanceName,
          children: [
            buildRadioField({
              id: 'usePersonalAllowance',
              name: m.usePersonalAllowance,
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
              name: m.personalAllowanceName,
              description: m.personalAllowanceDescription,
              children: [
                buildSelectField({
                  // This should probably be a text input with a format, and type number
                  name: m.paymentInformationPersonalAllowance,
                  id: 'personalAllowance.usage',
                  width: 'half',
                  options: [
                    { label: '100%', value: '100' },
                    { label: '75%', value: '75' },
                    { label: '50%', value: '50' },
                    { label: '25%', value: '25' },
                  ],
                }),
                buildTextField({
                  id: 'personalAllowance.usedAmount',
                  name: m.personalAllowanceUsedAmount,
                  width: 'half',
                  // placeholder: 'kr.', TODO use numberformatter?
                }),
                buildDateField({
                  id: 'personalAllowance.periodFrom',
                  name: m.personalAllowancePeriodFrom,
                  width: 'half',
                }),
                buildDateField({
                  id: 'personalAllowance.periodTo',
                  name: m.personalAllowancePeriodTo,
                  width: 'half',
                }),
              ],
            }),
            buildRadioField({
              id: 'usePersonalAllowanceFromSpouse',
              name: m.usePersonalAllowanceFromSpouse,
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
              name: m.personalAllowanceFromSpouseName,
              description: m.personalAllowanceFromSpouseDescription,
              children: [
                buildSelectField({
                  // This should probably be a text input with a format, and type number
                  name: m.paymentInformationPersonalAllowance,
                  id: 'personalAllowanceFromSpouse.usage',
                  width: 'half',
                  options: [
                    { label: '100%', value: '100' },
                    { label: '75%', value: '75' },
                    { label: '50%', value: '50' },
                    { label: '25%', value: '25' },
                  ],
                }),
                buildTextField({
                  id: 'personalAllowanceFromSpouse.usedAmount',
                  name: m.personalAllowanceUsedAmount,
                  width: 'half',
                  // placeholder: 'kr.', TODO use numberformatter?
                }),
                buildDateField({
                  id: 'personalAllowanceFromSpouse.periodFrom',
                  name: m.personalAllowancePeriodFrom,
                  width: 'half',
                }),
                buildDateField({
                  id: 'personalAllowanceFromSpouse.periodTo',
                  name: m.personalAllowancePeriodTo,
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'employer',
          name: m.employerSubSection,
          children: [
            buildRadioField({
              id: 'isSelfEmployed',
              name: mm.selfEmployed.title,
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
              // description:
              //   'Hér vantar helling af upplýsingum, hvað ef þú ert sjálfstætt starfandi?', // TODO
              name: m.employerTitle,
              condition: (answers) => answers.isSelfEmployed !== YES,
              children: [
                buildTextField({
                  name: m.employerName,
                  width: 'half',
                  // TODO when you can pass value from context
                  // disabled: true,
                  id: 'employer.name',
                }),
                buildTextField({
                  name: m.employerId,
                  width: 'half',
                  id: 'employer.nationalRegistryId',
                  format: '######-####',
                  placeholder: '000000-0000',
                }),
                // TODO this is no longer needed
                // buildDividerField({
                //   color: 'dark400',
                //   name:
                //     'Who on behalf of your employer will have to approve this application?',
                // }),
                // buildTextField({
                //   name: 'Contact name',
                //   width: 'half',
                //   id: 'employer.contact',
                // }),
                // buildTextField({
                //   name: 'Contact social security nr',
                //   width: 'half',
                //   id: 'employer.contactId',
                // }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'rights',
      name: m.rightsSection,
      children: [
        buildSubSection({
          id: 'rightsQuestions',
          name: m.yourRights,
          children: [
            buildMultiField({
              id: 'rightsIntro',
              name: m.theseAreYourRights,
              description: m.rightsDescription,
              children: [
                buildCustomField(
                  {
                    id: 'rightsIntro',
                    name: '',
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
              id: 'requestRights',
              name: m.requestRightsName,
              description: m.requestRightsDescription,
              children: [
                buildCustomField({
                  id: 'requestRights',
                  name: '',
                  component: 'RequestRights',
                }),
              ],
            }),
            buildMultiField({
              id: 'giveRights',
              name: m.giveRightsName,
              description: m.giveRightsDescription,
              condition: (formValue) => formValue.requestRights === NO,
              children: [
                buildCustomField({
                  id: 'giveRights',
                  name: '',
                  component: 'GiveRights',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'rightsReview',
          name: m.rightsSummarySubSection,
          children: [
            buildMultiField({
              id: 'reviewRights',
              name: m.rightsSummaryName,
              description: (application) =>
                `${formatIsk(
                  getEstimatedMonthlyPay(application),
                )} er áætluð mánaðarleg útborgun þín fyrir hvern heilan mánuð eftir skatt.`, // TODO messages
              children: [
                buildCustomField({
                  id: 'reviewRights',
                  name: '',
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
      name: m.periodsSection,
      children: [
        buildCustomField({
          id: 'periodsImageScreen',
          name: m.periodsImageTitle,
          component: 'PeriodsSectionImage',
        }),
        buildSubSection({
          id: 'firstPeriod',
          name: m.firstPeriodName,
          children: [
            buildRadioField({
              id: 'singlePeriod',
              name: m.periodAllAtOnce,
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
              name: mm.firstPeriodStart.title,
              component: 'FirstPeriodStart',
            }),
            buildMultiField({
              id: 'startDate',
              condition: (formValue) =>
                formValue.firstPeriodStart === 'specificDate',
              name: mm.startDate.title,
              description: mm.startDate.description,
              children: [
                buildDateField({
                  id: 'periods[0].startDate',
                  width: 'half',
                  name: mm.startDate.label,
                  placeholder: mm.startDate.placeholder,
                }),
              ],
            }),
            buildRadioField({
              id: 'confirmLeaveDuration',
              name: mm.duration.title,
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
              name: mm.endDate.title,
              description: mm.endDate.description,
              children: [
                buildDateField({
                  id: 'periods[0].endDate',
                  width: 'half',
                  name: mm.endDate.label,
                  placeholder: mm.endDate.placeholder,
                }),
              ],
            }),
            buildCustomField(
              {
                id: 'periods[0].endDate',
                condition: (formValue) =>
                  formValue.confirmLeaveDuration === 'duration',
                name: mm.duration.title,
                component: 'ParentalLeaveDuration',
              },
              {},
            ),
            buildMultiField({
              id: 'periods[0].ratio',
              name: mm.ratio.title,
              description: mm.ratio.description,
              children: [
                buildSelectField({
                  id: 'periods[0].ratio',
                  width: 'half',
                  name: mm.ratio.label,
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
        buildSubSection({
          id: 'addMorePeriods',
          name: mm.leavePlan.subSection,
          children: [
            buildRepeater({
              id: 'periods',
              name: mm.leavePlan.title,
              component: 'PeriodsRepeater',
              children: [
                buildDateField({
                  id: 'startDate',
                  name: mm.startDate.title,
                  description: mm.startDate.description,
                  placeholder: mm.startDate.placeholder,
                }),
                buildMultiField({
                  id: 'endDate',
                  name: mm.endDate.title,
                  description: mm.endDate.description,
                  children: [
                    buildDateField({
                      id: 'endDate',
                      name: mm.endDate.label,
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
                  name: mm.ratio.title,
                  description: mm.ratio.description,
                  children: [
                    buildSelectField({
                      id: 'ratio',
                      width: 'half',
                      name: mm.ratio.label,
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
          name: mm.paymentPlan.subSection,
          children: [
            buildCustomField(
              {
                id: 'paymentPlan',
                name: mm.paymentPlan.title,
                description: mm.paymentPlan.description,
                component: 'PaymentSchedule',
              },
              {},
            ),
          ],
        }),
        buildSubSection({
          id: 'shareInformation',
          name: mm.shareInformation.subSection,
          children: [
            buildRadioField({
              id: 'shareInformationWithOtherParent',
              name: mm.shareInformation.title,
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
      name: mm.confirmation.section,
      children: [
        buildMultiField({
          id: 'confirmation',
          name: mm.confirmation.title,
          description: mm.confirmation.description,
          children: [
            buildCustomField({
              id: 'confirmationScreen',
              name: '',
              component: 'Review',
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              name: mm.confirmation.title,

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
        buildIntroductionField({
          id: 'thankYou',
          name: mm.finalScreen.title,
          introduction: mm.finalScreen.description,
        }),
      ],
    }),
  ],
})
