import addDays from 'date-fns/addDays'

import {
  buildCustomField,
  buildDateField,
  buildForm,
  buildMultiField,
  buildRepeater,
  buildSection,
  buildSubmitField,
  buildSubSection,
  NO_ANSWER,
  buildRadioField,
  buildSelectField,
  buildTextField,
} from '@island.is/application/core'
import { Form, FormModes, Application } from '@island.is/application/types'
import {
  NO,
  PARENTAL_LEAVE,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  StartDateOptions,
  YES,
} from '../constants'

import Logo from '../assets/Logo'
import { parentalLeaveFormMessages } from '../lib/messages'
import {
  getApplicationAnswers,
  getAllPeriodDates,
  getEditOrAddInfoSectionDescription,
  getEditOrAddInfoSectionTitle,
  getPeriodSectionTitle,
  getLeavePlanTitle,
  getMinimumStartDate,
} from '../lib/parentalLeaveUtils'
import { minPeriodDays } from '../config'

export const EditOrAddEmployersAndPeriods: Form = buildForm({
  id: 'ParentalLeaveEditOrAddEmployersAndPeriods',
  title: parentalLeaveFormMessages.shared.formEditTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'editOrAddInfo',
      title: parentalLeaveFormMessages.shared.editOrAddInfoSection,
      children: [
        buildCustomField({
          id: 'periodsImageScreen',
          title: getEditOrAddInfoSectionTitle,
          description: getEditOrAddInfoSectionDescription,
          component: 'PeriodsSectionImage',
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
        buildSubSection({
          id: 'addEmployer',
          title: parentalLeaveFormMessages.shared.employerSubSection,
          children: [
            buildRadioField({
              id: 'addEmployer',
              title: parentalLeaveFormMessages.shared.editOrAddEmployer,
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
            buildRepeater({
              id: 'employers',
              title: parentalLeaveFormMessages.employer.title,
              component: 'EmployersOverview',
              condition: (answers) => {
                const { addEmployer } = getApplicationAnswers(answers)
                return addEmployer === YES
              },
              children: [
                buildMultiField({
                  id: 'addEmployers',
                  title: parentalLeaveFormMessages.employer.registration,
                  isPartOfRepeater: true,
                  children: [
                    buildTextField({
                      id: 'email',
                      variant: 'email',
                      dataTestId: 'employer-email',
                      title: parentalLeaveFormMessages.employer.email,
                    }),
                    buildTextField({
                      id: 'phoneNumber',
                      variant: 'tel',
                      dataTestId: 'employer-phone-number',
                      format: '###-####',
                      placeholder: '000-0000',
                      title: parentalLeaveFormMessages.employer.phoneNumber,
                    }),
                    buildSelectField({
                      id: 'ratio',
                      dataTestId: 'employment-ratio',
                      title: parentalLeaveFormMessages.employer.ratio,
                      placeholder:
                        parentalLeaveFormMessages.employer.ratioPlaceholder,
                      options: Array(100)
                        .fill(undefined)
                        .map((_, idx, array) => ({
                          value: `${array.length - idx}`,
                          label: `${array.length - idx}%`,
                        })),
                    }),
                    buildRadioField({
                      id: 'stillEmployed',
                      condition: (answers) => {
                        const { applicationType, employerLastSixMonths } =
                          getApplicationAnswers(answers)

                        return (
                          (applicationType === PARENTAL_GRANT ||
                            applicationType === PARENTAL_GRANT_STUDENTS) &&
                          employerLastSixMonths === YES
                        )
                      },
                      title: parentalLeaveFormMessages.employer.stillEmployed,
                      width: 'half',
                      space: 3,
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
      id: 'editOrAddPeriods',
      title: getPeriodSectionTitle,
      children: [
        buildSubSection({
          id: 'addPeriods',
          title: parentalLeaveFormMessages.leavePlan.subSection,
          children: [
            buildRadioField({
              id: 'addPeriods',
              title: parentalLeaveFormMessages.shared.editOrAddPeriods,
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
            buildRepeater({
              id: 'periods',
              title: getLeavePlanTitle,
              component: 'PeriodsRepeater',
              condition: (answers) => {
                const { addPeriods } = getApplicationAnswers(answers)
                return addPeriods === YES
              },
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
                  title: parentalLeaveFormMessages.duration.title,
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
                      const period = rawPeriods[rawPeriods.length - 1]

                      return period?.useLength === NO && !!period?.startDate
                    },
                  },
                  {
                    minDate: (application: Application) => {
                      const { rawPeriods } = getApplicationAnswers(
                        application.answers,
                      )
                      const latestStartDate =
                        rawPeriods[rawPeriods.length - 1]?.startDate

                      return addDays(
                        new Date(latestStartDate),
                        minPeriodDays - 1,
                      )
                    },
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
                  title: parentalLeaveFormMessages.ratio.title,
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
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: parentalLeaveFormMessages.confirmation.section,
      children: [
        buildSubSection({
          title: '',
          children: [
            buildMultiField({
              id: 'confirmation',
              title: '',
              description: '',
              children: [
                buildCustomField({
                  id: 'confirmationScreen',
                  title: '',
                  component: 'EditOrAddEmployersAndPeriodsReview',
                }),
                buildSubmitField({
                  id: 'submit',
                  placement: 'footer',
                  title: parentalLeaveFormMessages.confirmation.title,
                  actions: [
                    {
                      event: 'ABORT',
                      name: parentalLeaveFormMessages.confirmation.cancel,
                      type: 'reject',
                    },
                    {
                      event: 'SUBMIT',
                      name: parentalLeaveFormMessages.confirmation.title,
                      type: 'primary',
                      condition: (answers) => {
                        // Only display Submit button if changes made
                        const { addPeriods, addEmployer } =
                          getApplicationAnswers(answers)
                        return addPeriods === YES || addEmployer === YES
                      },
                    },
                  ],
                }),
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
