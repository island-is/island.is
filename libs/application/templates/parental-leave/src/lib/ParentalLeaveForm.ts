import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildCustomField,
  buildIntroductionField,
  Form,
  ApplicationTypes,
  DataProviderTypes,
  buildRadioField,
  buildMultiField,
  buildTextField,
  buildRepeater,
  buildDateField,
  buildSelectField,
} from '@island.is/application/core'
import { m } from './messages'

export const ParentalLeaveForm: Form = buildForm({
  id: ApplicationTypes.PARENTAL_LEAVE,
  ownerId: 'DOL',
  name: 'Fæðingarorlof',
  children: [
    buildSection({
      id: 'theApplicant',
      name: m.applicantSection,
      children: [
        buildExternalDataProvider({
          name: m.introductionProvider,
          id: 'approveExternalData',
          dataProviders: [
            buildDataProviderItem({
              id: 'salary',
              type: DataProviderTypes.ExampleSucceeds,
              source: 'RSK',
              title: m.salaryTitle,
              subTitle: m.salarySubtitle,
            }),
            buildDataProviderItem({
              id: 'expectedDateOfBirth',
              type: DataProviderTypes.ExpectedDateOfBirth,
              source: 'Landlækni',
              title: m.expectedDateOfBirthTitle,
              subTitle: m.expectedDateOfBirthSubtitle,
            }),
            buildDataProviderItem({
              id: 'shareInformation',
              type: DataProviderTypes.ExampleSucceeds,
              source: undefined,
              subTitle:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              title: 'Miðlun upplýsinga',
            }),
          ],
        }),
        buildMultiField({
          id: 'contactInfo',
          name: 'Er þetta réttur sími og netfang?',
          description: 'Vinsamlegast breyttu ef þetta er ekki rétt',
          children: [
            buildTextField({
              width: 'half',
              name: 'Netfang',
              id: 'applicant.email',
            }),
            buildTextField({
              width: 'half',
              name: 'Símanúmer',
              id: 'applicant.phoneNumber',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'sharedTime',
      name: m.sharedTimeSection,
      children: [
        buildCustomField(
          {
            id: 'usage',
            name: m.usage,
            required: true,
            component: 'ParentalLeaveUsage',
          },
          {},
        ),
      ],
    }),
    buildSection({
      id: 'leavePeriods',
      name: m.periodsSection,
      children: [
        buildIntroductionField({
          id: 'periodsImageScreen',
          name:
            'Next you will be able to choose when and how long to take your leave.',
          introduction: 'Here we will add a nice picture',
        }),
        buildRadioField({
          id: 'singlePeriod',
          name: 'Do you plan to take your leave all at once?',
          description:
            'Some people choose to take the full leave all at once, while others choose to split their leave into separate periods.',
          emphasize: true,
          largeButtons: true,
          options: [
            { label: 'Yes, I plan to take my leave all at once', value: 'yes' },
            {
              label: 'No, I plan to split my leave into separate periods',
              value: 'no',
            },
          ],
        }),
        buildRadioField({
          id: 'firstPeriod',
          name: 'When would you like to start your leave?',
          description:
            'You can choose to start on the date of birth, or on a specific date. Please note, that your rights end 18 months after the date of birth.',
          emphasize: true,
          largeButtons: true,
          // TODO ADD INFO tag
          options: [
            {
              label: 'I will start my leave from the date of birth',
              value: 'startOnDateOfBirth',
            },
            {
              label: 'I will start my leave on a specific date',
              value: 'startOnSpecificDate',
            },
          ],
        }),
        buildMultiField({
          id: 'startDate',
          name: 'When would you like to start your leave',
          description:
            'You can choose to start on the date of birth, or on a specific date. Please note, that your rights end 18 months after the date of birth.',
          children: [
            buildDateField({
              id: 'periods[0].startDate',
              width: 'half',
              name: 'Period start date',
              placeholder: 'Please choose the start date',
            }),
          ],
        }),
        buildCustomField(
          {
            id: 'periods[0].endDate',
            name: m.duration,
            required: true,
            component: 'ParentalLeaveDuration',
          },
          {},
        ),
        buildMultiField({
          id: 'ratio',
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
            buildCustomField(
              {
                id: 'endDate',
                name: m.duration,
                description: m.durationDescription,
                required: true,
                component: 'ParentalLeaveDuration',
              },
              {
                showTimeline: true,
              },
            ),
          ],
        }),
        buildRadioField({
          id: 'shareInformationWithSpouse',
          name:
            'Do you want to share your leave information with your partner?',
          description:
            'Some people share their information to coordinate their parental leaves.',
          emphasize: false,
          largeButtons: true,
          options: [
            {
              label:
                'Yes, I want to share my leave information with my partner',
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
    buildSection({
      id: 'paymentDetails',
      name: 'Payment details',
      children: [
        buildIntroductionField({
          id: 'paymentsImageScreen',
          name: 'Next we will verify your bank information for payments',
          introduction: 'Here we will add a nice picture',
        }),
        buildMultiField({
          name: 'Is everything how it is supposed to be?',
          id: 'payments',
          children: [
            buildTextField({
              name: 'Bank details',
              id: 'payments.bank',
              width: 'half',
            }),
            buildSelectField({
              name: 'Personal allowance usage',
              id: 'payments.personalAllowanceUsage',
              width: 'half',
              options: [
                { label: '100%', value: '100' },
                { label: '75%', value: '75' },
                { label: '50%', value: '50' },
                { label: '25%', value: '25' },
              ],
            }),
            buildSelectField({
              name: 'Pension fund (optional)',
              id: 'payments.pensionFund',
              width: 'half',
              options: [{ label: 'TODO', value: 'todo' }],
            }),
            buildSelectField({
              name: 'Union (optional)',
              id: 'payments.union',
              width: 'half',
              options: [{ label: 'TODO', value: 'todo' }],
            }),
            buildRadioField({
              emphasize: true,
              largeButtons: false,
              id: 'usePrivatePensionFund',
              name: 'Do you wish to pay to a private pension fund?',
              description:
                'Note that Department of Parental Leave does not pay counter-contribution.',
              options: [
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
              ],
            }),
          ],
        }),
        buildMultiField({
          id: 'privatePensionFund',
          condition: (formValue) => formValue.privatePensionFund === 'yes',
          name: 'Private pension fund information',
          children: [
            buildSelectField({
              id: 'payments.privatePensionFund',
              name: 'Private pension fund',
              width: 'half',
              options: [{ label: 'Frjalsi', value: 'frjalsi' }],
            }),
            buildSelectField({
              id: 'payments.privatePensionFundPercentage',
              name: 'Private pension fund %',
              width: 'half',
              options: [
                { label: '2%', value: '2' },
                { label: '4%', value: '4' },
              ],
            }),
          ],
        }),
        buildMultiField({
          id: 'employer',
          name: 'Who is your employer?',
          children: [
            buildTextField({
              name: 'Employer',
              width: 'half',
              // TODO when you can pass value from context
              // disabled: true,
              id: 'employer.name',
            }),
            buildTextField({
              name: 'Employer national registry id',
              width: 'half',
              id: 'employer.nationalRegistryId',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'paymentSchedule',
      name: 'Payment Schedule',
      children: [
        buildCustomField(
          {
            id: 'info',
            name: 'Payment schedule',
            component: 'PaymentScheduleInformation',
          },
          {},
        ),
        buildCustomField(
          {
            id: 'schedule',
            name: 'Payment schedule',
            component: 'PaymentSchedule',
          },
          {},
        ),
        buildCustomField(
          {
            id: 'salary',
            name: 'Salary payments',
            component: 'SalaryScreen',
          },
          {},
        ),
      ],
    }),
    buildSection({
      id: 'confirmation',
      name: 'Confirmation',
      children: [
        buildCustomField(
          {
            id: 'confirmationScreen',
            name: (application) =>
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              `Thanks for applying ${application.externalData?.applicant?.name}`,
            component: 'Confirmation',
          },
          {},
        ),
        buildIntroductionField({
          id: 'thankYou',
          name: 'Confirmation',
          introduction:
            'Your application is now under review. TODO this screen better',
        }),
      ],
    }),
  ],
})
