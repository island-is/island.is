import {
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
import { m } from '../lib/messages'
import {
  formatIsk,
  getEstimatedMonthlyPay,
  getNameAndIdOfSpouse,
} from '../fields/parentalLeaveUtils'
import { GetPensionFunds, GetUnions } from '../graphql/queries'

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
          id: 'generalInfo',
          name: m.generalInfoSubSection,
          children: [
            buildMultiField({
              id: 'contactInfo',
              name: 'Er þetta réttur sími og netfang?',
              description: 'Vinsamlegast breyttu ef þetta er ekki rétt',
              children: [
                buildTextField({
                  width: 'half',
                  name: 'Netfang',
                  id: 'applicant.email',
                  variant: 'email',
                }),
                buildTextField({
                  width: 'half',
                  name: 'Símanúmer',
                  id: 'applicant.phoneNumber',
                  variant: 'tel',
                  format: '###-####',
                  placeholder: '000-0000',
                }),
              ],
            }),
            buildMultiField({
              id: 'otherParent',
              name: m.otherParentTitle,
              description: m.otherParentDescription,
              condition: () => {
                // TODO this screen is only for the primary parent
                return true
              },
              children: [
                buildRadioField({
                  id: 'otherParent',
                  name: '',
                  options: (application) => {
                    const [spouseName, spouseId] = getNameAndIdOfSpouse(
                      application,
                    )
                    const options: Option[] = [
                      {
                        value: 'no',
                        label: m.noOtherParent,
                      },
                      { value: 'manual', label: m.otherParentOption },
                    ]
                    if (spouseName !== undefined && spouseId !== undefined) {
                      options.unshift({
                        value: 'spouse',
                        label: () => ({
                          ...m.otherParentSpouse,
                          values: { spouseName, spouseId },
                        }),
                      })
                    }
                    return options
                  },
                  emphasize: false,
                  largeButtons: true,
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
                  variant: 'number',
                }),
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
                buildSelectField({
                  name: m.paymentInformationPersonalDiscount,
                  id: 'payments.personalAllowanceUsage',
                  width: 'half',
                  options: [
                    { label: '100%', value: '100' },
                    { label: '75%', value: '75' },
                    { label: '50%', value: '50' },
                    { label: '25%', value: '25' },
                  ],
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
                  loadingError: m.loadingError,
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
                    { label: m.yesOptionLabel, value: 'yes' },
                    { label: m.noOptionLabel, value: 'no' },
                  ],
                }),
                buildSelectField({
                  condition: (answers) =>
                    answers.usePrivatePensionFund === 'yes',
                  id: 'payments.privatePensionFund',
                  name: m.privatePensionFund,
                  width: 'half',
                  options: [{ label: 'Frjalsi', value: 'frjalsi' }],
                }),
                buildSelectField({
                  condition: (answers) =>
                    answers.usePrivatePensionFund === 'yes',
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
          id: 'employer',
          name: m.employerSubSection,
          children: [
            buildMultiField({
              id: 'employer',
              description:
                'Hér vantar helling af upplýsingum, hvað ef þú ert sjálfstætt starfandi?', // TODO
              name: m.employerTitle,
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
              condition: (formValue) => formValue.requestRights === 'no',
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
              emphasize: true,
              largeButtons: true,
              options: [
                {
                  label: m.periodAllAtOnceYes,
                  value: 'yes',
                },
                {
                  label: m.periodAllAtOnceNo,
                  value: 'no',
                },
              ],
            }),
            buildCustomField({
              id: 'firstPeriodStart',
              name: (application) =>
                application.answers.singlePeriod === 'yes'
                  ? 'Hvenær viltu hefja fæðingarorlofið?'
                  : 'Hvenær viltu hefja fyrsta tímabilið?', // TODO Messages
              component: 'FirstPeriodStart',
            }),
            buildMultiField({
              id: 'startDate',
              condition: (formValue) =>
                formValue.firstPeriodStart === 'specificDate',
              name: 'Please pick the start date',
              description:
                'You can choose to start on the date of birth, or on a specific date. Please note, that your rights end 18 months after the date of birth.',
              children: [
                buildDateField({
                  id: 'periods[0].startDate',
                  width: 'half',
                  name: 'Start date',
                  placeholder: 'Pick the start date',
                }),
              ],
            }),
            buildRadioField({
              id: 'confirmLeaveDuration',
              name: 'Please confirm your leave duration',
              description:
                'Some people choose to take the full leave all at once, but also extend it by months or to a certain date by adjusting their income.',
              largeButtons: true,
              emphasize: true,
              options: [
                { label: 'A certain duration', value: 'duration' },
                { label: 'Until a specific date', value: 'specificDate' },
              ],
            }),
            buildMultiField({
              id: 'endDate',
              condition: (formValue) =>
                formValue.confirmLeaveDuration === 'specificDate',
              name: 'Please pick the end date',
              description:
                'You can choose to end the parental leave no later than 18 months after the date of birth.',
              children: [
                buildDateField({
                  id: 'periods[0].endDate',
                  width: 'half',
                  name: 'End date',
                  placeholder: 'Pick the end date',
                }),
              ],
            }),
            buildCustomField(
              {
                id: 'periods[0].endDate',
                condition: (formValue) =>
                  formValue.confirmLeaveDuration === 'duration',
                name: m.duration,
                component: 'ParentalLeaveDuration',
              },
              {},
            ),
            buildMultiField({
              id: 'periods[0].ratio',
              name: 'What percent off will you take for this period?',
              description:
                'For example, you could work 50% of the time, and have 50% paid leave.',
              children: [
                buildSelectField({
                  id: 'periods[0].ratio',
                  width: 'half',
                  name: 'Percent leave',
                  placeholder: 'Pick your percent',
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
          name: 'Add more periods',
          children: [
            buildRepeater({
              id: 'periods',
              name: 'Here is your current leave plan',
              component: 'PeriodsRepeater',
              children: [
                buildDateField({
                  id: 'startDate',
                  name: 'Adding a period',
                  description:
                    'You can choose to start on the date of birth, or on a specific date. Please note, that your rights end 18 months after the date of birth.',
                  placeholder: 'Pick the start date',
                }),
                buildMultiField({
                  id: 'endDate',
                  name: 'Please pick the end date',
                  description:
                    'You can choose to end the parental leave no later than 18 months after the date of birth.',
                  children: [
                    buildDateField({
                      id: 'endDate',
                      name: 'End date',
                      placeholder: 'Pick the end date',
                    }),
                  ],
                }),
                // buildCustomField(
                //   {
                //     id: 'endDate',
                //     name: m.duration,
                //     description: m.durationDescription,
                //     component: 'ParentalLeaveDuration',
                //   },
                //   {
                //     showTimeline: true,
                //   },
                // ),
                buildMultiField({
                  id: 'ratio',
                  name: 'What percent off will you take for this period?',
                  description:
                    'For example, you could work 50% of the time, and have 50% paid leave.',
                  children: [
                    buildSelectField({
                      id: 'ratio',
                      width: 'half',
                      name: 'Percent leave',
                      placeholder: 'Pick your percent',
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
          name: 'Payment plan',
          children: [
            buildCustomField(
              {
                id: 'paymentPlan',
                name: 'Here is your current payment plan',
                description:
                  'Payments amount to 80% of the average of your total wages during the last 6 months before the birth of the child.',
                component: 'PaymentSchedule',
              },
              {},
            ),
          ],
        }),
        buildSubSection({
          id: 'shareInformation',
          name: 'Share information with other parent',
          children: [
            buildRadioField({
              id: 'shareInformationWithOtherParent',
              name:
                'Do you want to share your leave information with the other parent?',
              description:
                'Some people share their information to coordinate their parental leaves.',
              emphasize: false,
              largeButtons: true,
              options: [
                {
                  label:
                    'Yes, I want to share my leave information with the other parent',
                  value: 'yes',
                },
                {
                  label: 'No, I do not want to share my information',
                  value: 'no',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      name: 'Confirmation',
      children: [
        buildMultiField({
          id: 'confirmation',
          name: 'Review and submit',
          children: [
            buildCustomField({
              id: 'confirmationScreen',
              name: 'Final review',
              description:
                'Please review your information before submiting the application.',
              component: 'Review',
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              name: 'Submit',

              actions: [{ event: 'SUBMIT', name: 'Submit', type: 'primary' }],
            }),
          ],
        }),
        buildIntroductionField({
          id: 'thankYou',
          name: 'All done, here are the next steps:',
          introduction:
            'The other parent will need to approve your request to use their shared month (if you did so). Then, ' +
            'your employer will approve your parental leave dates.' +
            'And finally Vinnumálastofnun will review your application.',
        }),
      ],
    }),
  ],
})
