import addDays from 'date-fns/addDays'

import {
  buildCustomField,
  buildDateField,
  buildForm,
  buildMultiField,
  buildRepeater,
  buildSection,
  buildSelectField,
  buildSubmitField,
  buildSubSection,
  NO_ANSWER,
  buildRadioField,
} from '@island.is/application/core'
import { Form, FormModes, Application } from '@island.is/application/types'
import { NO, StartDateOptions, YES } from '../constants'

import Logo from '../assets/Logo'
import { parentalLeaveFormMessages } from '../lib/messages'
import {
  getApplicationAnswers,
  getAllPeriodDates,
  getExpectedDateOfBirth,
  getLastValidPeriodEndDate,
} from '../lib/parentalLeaveUtils'
import {
  minimumPeriodStartBeforeExpectedDateOfBirth,
  minPeriodDays,
} from '../config'

export const EditOrAddPeriods: Form = buildForm({
  id: 'ParentalLeaveEditOrAddPeriods',
  title: 'Edit or add periods',
  logo: Logo,
  mode: FormModes.EDITING,
  children: [
    buildSection({
      id: 'editOrAddPeriods',
      title: parentalLeaveFormMessages.shared.periodsSection,
      children: [
        buildCustomField({
          id: 'periodsImageScreen',
          title: parentalLeaveFormMessages.shared.periodsImageTitle,
          component: 'PeriodsSectionImage',
          doesNotRequireAnswer: true,
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
                  defaultValue: NO_ANSWER,
                  condition: (answers) => {
                    const { periods, rawPeriods } = getApplicationAnswers(
                      answers,
                    )
                    const currentPeriod = rawPeriods[rawPeriods.length - 1]
                    const firstPeriodRequestingSpecificStartDate =
                      currentPeriod?.firstPeriodStart ===
                      StartDateOptions.SPECIFIC_DATE

                    return (
                      firstPeriodRequestingSpecificStartDate ||
                      periods.length !== 0
                    )
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
                  defaultValue: NO_ANSWER,
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

                      return addDays(
                        new Date(latestStartDate),
                        minPeriodDays + 1,
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
                }),
              ],
            }),
          ],
        }),
        //   buildSection({
        //     id: 'editOrAddPeriods',
        //     title: parentalLeaveFormMessages.leavePlan.title,
        //     children: [
        //       buildRepeater({
        //         id: 'periods',
        //         title: parentalLeaveFormMessages.leavePlan.title,
        //         component: 'PeriodsRepeater',
        //         children: [
        //           buildDateField({
        //             id: 'startDate',
        //             title: parentalLeaveFormMessages.startDate.title,
        //             description: parentalLeaveFormMessages.startDate.description,
        //             placeholder: parentalLeaveFormMessages.startDate.placeholder,
        //             excludeDates: (application) => {
        //               const { periods } = getApplicationAnswers(application.answers)

        //               return getAllPeriodDates(periods)
        //             },
        //           }),
        //           buildMultiField({
        //             id: 'endDate',
        //             title: parentalLeaveFormMessages.endDate.title,
        //             description: parentalLeaveFormMessages.endDate.description,
        //             children: [
        //               buildDateField({
        //                 id: 'endDate',
        //                 title: parentalLeaveFormMessages.endDate.label,
        //                 placeholder: parentalLeaveFormMessages.endDate.placeholder,
        //                 excludeDates: (application) => {
        //                   const { periods } = getApplicationAnswers(
        //                     application.answers,
        //                   )

        //                   return getAllPeriodDates(periods)
        //                 },
        //               }),
        //             ],
        //           }),
        //           buildMultiField({
        //             id: 'ratio',
        //             title: parentalLeaveFormMessages.ratio.title,
        //             description: parentalLeaveFormMessages.ratio.description,
        //             children: [
        //               buildSelectField({
        //                 id: 'ratio',
        //                 width: 'half',
        //                 title: parentalLeaveFormMessages.ratio.label,
        //                 defaultValue: '100',
        //                 placeholder: parentalLeaveFormMessages.ratio.placeholder,
        //                 options: [
        //                   { label: '100%', value: '100' },
        //                   { label: '75%', value: '75' },
        //                   { label: '50%', value: '50' },
        //                   { label: '25%', value: '25' },
        //                 ],
        //               }),
        //             ],
        //           }),
        //         ],
        //       }),
        buildMultiField({
          id: 'confirmation',
          title: parentalLeaveFormMessages.confirmation.title,
          description: parentalLeaveFormMessages.confirmation.description,
          children: [
            buildCustomField({
              id: 'confirmationScreen',
              title: parentalLeaveFormMessages.confirmation.title,
              component: 'EditPeriodsReview',
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: parentalLeaveFormMessages.confirmation.title,
              actions: [
                { name: 'Cancel', type: 'reject', event: 'ABORT' },
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
