import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildCustomField,
  buildIntroductionField,
  Form,
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
  id: 'ParentalLeaveDraft',
  name: 'Fæðingarorlof',
  children: [
    buildSection({
      id: 'theApplicant',
      name: m.applicantSection,
      children: [
        buildCustomField(
          {
            id: 'scheduleTest',
            name: 'Here is your current leave plan',
            component: 'PaymentSchedule',
          },
          {},
        ),
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
        buildMultiField({
          id: 'secondaryParent',
          name: 'Confirm the other parent (if any)',
          description:
            'This person is by default your spouse or partner. If there is no other parent in the picture at this point in time, leave this empty.',
          condition: () => {
            // TODO this screen is only for the primary parent
            return true
          },
          children: [
            buildTextField({
              id: 'secondaryParentName',
              name: 'Name of other parent',
              width: 'half',
            }),
            buildTextField({
              id: 'secondaryParentId',
              name: 'National ID of other parent',
              width: 'half',
            }),
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
          condition: (formValue) => formValue.usePrivatePensionFund === 'yes',
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
      id: 'rights',
      name: 'Parental leave rights',
      children: [
        buildIntroductionField({
          id: 'rights.intro',
          name: 'These are your rights',
          introduction:
            'Both parents have 6 months, but can give up to 1 month to the other parent. TODO maybe ad the boxes below? Should we add the payments rule here as well?',
        }),
        buildRadioField({
          id: 'requestExtraTime',
          name: 'Do you want to request extra time from the other parent?',
          description: 'Your partner can give up to 1 month of their rights',
          emphasize: true,
          largeButtons: true,
          options: [
            {
              label: 'Yes, I want to request extra time from my partner',
              value: 'yes',
            },
            { label: 'No, I will only use my rights', value: 'no' },
          ],
        }),
        buildRadioField({
          id: 'giveExtraTime',
          name: 'Do you want to give the other parent more parental leave?',
          description:
            'You can give the other parent up to 1 month of your rights',
          emphasize: true,
          largeButtons: true,
          condition: (formValue) => formValue.requestExtraTime === 'no',
          options: [
            {
              label:
                'Yes, I want to give up to 1 month of my rights to the other parent',
              value: 'yes',
            },
            { label: 'No, I want to keep my months for myself', value: 'no' },
          ],
        }),
        buildMultiField({
          id: 'rightsSummary',
          name: 'Monthly salary for your parental leave',
          description: () =>
            `384.000 kr. is your expected payment for each full month of leave`,
          children: [
            buildIntroductionField({
              id: 'todosummary',
              name: 'TODO add the custom boxes component',
              introduction:
                '* You will need to change the application if the other parent does not approve the extra month you requested.',
            }),
          ],
        }),
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
              label:
                'I want to customize my leave into multiple periods and/or to stretch it out over time at less than 100% time off.',
              value: 'no',
            },
          ],
        }),
        buildRadioField({
          id: 'firstPeriod',
          name: (application) =>
            application.answers.singlePeriod === 'yes'
              ? 'When would you like to start your leave?'
              : 'When do you want to start this period?',
          description:
            'You can choose to start on the date of birth, or on a specific date. Please note, that your rights end 18 months after the date of birth.',
          emphasize: true,
          largeButtons: true,
          // TODO ADD INFO tag
          options: [
            {
              label: 'I will start from the date of birth',
              value: 'dateOfBirth',
              tooltip:
                'If the child is born on another date than the expected date of birth, the parental leave and its duration will adjust to the real date of birth',
            },
            {
              label: 'I will start on a specific date',
              tooltip:
                'If the child is born on another date than the expected date of birth, the parental leave and its duration will !!!!NOT!!!! adjust to the real date of birth',
              value: 'specificDate',
            },
          ],
        }),
        buildMultiField({
          id: 'startDate',
          condition: (formValue) => formValue.firstPeriod === 'specificDate',
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
          id: 'startDate',
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
          condition: (formValue) => formValue.singlePeriod === 'no',
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
                component: 'ParentalLeaveDuration',
              },
              {
                showTimeline: true,
              },
            ),
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
        buildCustomField(
          {
            id: 'paymentPlan',
            name: 'Here is your current payment plan',
            description:
              'Payments amount to 80% of the average of your total wages during the last 6 monhts before the birth of the child. TODO add the table',
            component: 'PaymentPlan',
          },
          {},
        ),
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
    buildSection({
      id: 'confirmation',
      name: 'Confirmation',
      children: [
        buildCustomField(
          {
            id: 'confirmationScreen',
            name: 'Review Screen....TODO',
            component: 'Confirmation',
          },
          {},
        ),
        buildIntroductionField({
          id: 'thankYou',
          name: 'All done, here are the next steps:',
          introduction:
            '1. The other parent will need to approve your request to use their shared month (if you did so)' +
            '\\n 2. Your employer will approve your parental leave dates' +
            '\\n 3. Vinnumálastofnun will review your application',
        }),
      ],
    }),
  ],
})
