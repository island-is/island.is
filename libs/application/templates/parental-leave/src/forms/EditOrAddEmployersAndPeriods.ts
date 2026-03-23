import {
  NO,
  NO_ANSWER,
  YES,
  buildCustomField,
  buildDateField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildRepeater,
  buildSection,
  buildSubSection,
  buildSubmitField,
  buildTableRepeaterField,
  formatText,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
} from '@island.is/application/types'
import {
  FILE_SIZE_LIMIT,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
  StartDateOptions,
} from '../constants'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import { parentalLeaveFormMessages } from '../lib/messages'
import {
  getAllPeriodDates,
  getApplicationAnswers,
  getConclusionScreenSteps,
  getLeavePlanTitle,
  getMinimumEndDate,
  getMinimumStartDate,
  getPeriodSectionTitle,
} from '../lib/parentalLeaveUtils'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { useLocale } from '@island.is/localization'

export const EditOrAddEmployersAndPeriods: Form = buildForm({
  id: 'ParentalLeaveEditOrAddEmployersAndPeriods',
  title: parentalLeaveFormMessages.shared.formEditTitle,
  logo: DirectorateOfLabourLogo,
  mode: FormModes.DRAFT,
  children: [
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
            isReceivingUnemploymentBenefits !== YES &&
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
              condition: (answers) => {
                const { addEmployer } = getApplicationAnswers(answers)
                return addEmployer === YES
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
              condition: (answers) => {
                const { addEmployer } = getApplicationAnswers(answers)

                return addEmployer === YES
              },
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
      ],
    }),
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
