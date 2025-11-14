import {
  buildAlertMessageField,
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  coreMessages,
  getValueViaPath,
  NO,
  YES,
  YesOrNoEnum,
} from '@island.is/application/core'
import { employment as employmentMessages } from '../../../lib/messages'
import { Application, FormValue } from '@island.is/application/types'
import {
  isIndependent,
  isEmployed,
  isOccasionallyEmployed,
  isEmployedPartTime,
  isUnemployed,
  hasDataFromCurrentStatusItem,
  getDefaultFromCurrentStatus,
  hasEmployer,
  hasDataFromCurrentStatus,
  getChosenEmployerNationalId,
  getChosenEmployerName,
} from '../../../utils'
import { CurrentEmploymentInAnswers, EmploymentStatus } from '../../../shared'
import { getJobCodeOptions } from '../../../utils/getJobCodeOptions'
import { getRskOptions } from '../../../utils/getRskOptions'

export const employmentHistorySubSection = buildSubSection({
  id: 'employmentHistorySubSection',
  title: employmentMessages.employmentHistory.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'employmentHistorySubSection',
      title: employmentMessages.employmentHistory.general.pageTitle,
      description: employmentMessages.employmentHistory.general.pageDescription,
      children: [
        buildRadioField({
          id: 'employmentHistory.isIndependent',
          title:
            employmentMessages.employmentHistory.labels.independentCheckbox,
          width: 'half',
          marginBottom: 2,
          defaultValue: NO,
          options: [
            {
              value: YES,
              label: coreMessages.radioYes,
            },
            {
              value: NO,
              label: coreMessages.radioNo,
            },
          ],
        }),
        buildRadioField({
          id: 'employmentHistory.independentOwnSsn',
          title:
            employmentMessages.employmentHistory.labels
              .independentOwnSSNCheckbox,
          width: 'half',
          marginBottom: 2,
          defaultValue: NO,
          condition: (answers) => {
            const isIndependent = getValueViaPath<YesOrNoEnum>(
              answers,
              'employmentHistory.isIndependent',
              undefined,
            )
            return isIndependent === YesOrNoEnum.YES
          },
          options: [
            {
              value: YES,
              label: coreMessages.radioYes,
            },
            {
              value: NO,
              label: coreMessages.radioNo,
            },
          ],
        }),
        /* IS INDEPENDENT */
        buildAlertMessageField({
          id: 'employmentHistoryIndependentAlertMessage',
          message:
            employmentMessages.employmentHistory.labels.workOnOwnSSNAlert,
          alertType: 'info',
          doesNotRequireAnswer: true,
          condition: isIndependent,
        }),
        /* IS NOT INDEPENDENT */
        buildDescriptionField({
          id: 'employmentHistoryNotIndependentDescription',
          title: employmentMessages.employmentHistory.labels.lastJobLabel,
          titleVariant: 'h5',
          condition: (answers) => !isIndependent(answers),
        }),
        buildFieldsRepeaterField({
          id: 'employmentHistory.currentJobs',
          hideAddButton: true,
          maxRows: (answers: FormValue) => {
            const currentSituationRepeater =
              getValueViaPath<Array<CurrentEmploymentInAnswers>>(
                answers,
                'currentSituation.currentSituationRepeater',
                [],
              ) ?? []

            const maxRows =
              isOccasionallyEmployed(answers) || isEmployedPartTime(answers)
                ? currentSituationRepeater.length
                : 0
            return maxRows
          },
          minRows: (answers: FormValue) => {
            const currentSituationRepeater =
              getValueViaPath<Array<CurrentEmploymentInAnswers>>(
                answers,
                'currentSituation.currentSituationRepeater',
                [],
              ) ?? []

            const minRows =
              isOccasionallyEmployed(answers) || isEmployedPartTime(answers)
                ? currentSituationRepeater.length
                : 0
            return minRows
          },
          marginTop: 0,
          marginBottom: 0,
          formTitle:
            employmentMessages.employmentHistory.labels.lastJobRepeater,
          formTitleVariant: 'h5',
          fields: {
            employer: {
              component: 'nationalIdWithName',
              required: true,
              searchPersons: true,
              searchCompanies: true,
              readonly: true,
              defaultValue: (
                application: Application,
                _activeField: Record<string, string>,
                index: number,
              ) => {
                const repeaterJobs =
                  getValueViaPath<CurrentEmploymentInAnswers[]>(
                    application.answers,
                    'currentSituation.currentSituationRepeater',
                    [],
                  ) ?? []

                if (
                  isUnemployed(application.answers) ||
                  repeaterJobs.length === 0 ||
                  !repeaterJobs[index]
                ) {
                  return ''
                }

                const nationalIdChosen = getChosenEmployerNationalId(
                  repeaterJobs,
                  index,
                )

                const name = getChosenEmployerName(
                  repeaterJobs,
                  index,
                  application.externalData,
                  nationalIdChosen,
                )

                const defaultValue = {
                  nationalId: nationalIdChosen,
                  name: name,
                }

                return defaultValue
              },
            },
            title: {
              component: 'select',
              label: employmentMessages.employmentHistory.labels.lastJobTitle,
              width: 'half',
              required: true,
              options: (application, _activeField, locale) =>
                getJobCodeOptions(application, locale),
              readonly: (application, _activeField, index) => {
                return hasDataFromCurrentStatusItem(
                  application.answers,
                  index,
                  'title',
                )
              },
              defaultValue: (
                application: Application,
                _activeField: Record<string, string>,
                index: number,
              ) => {
                const repeaterJobs =
                  getValueViaPath<CurrentEmploymentInAnswers[]>(
                    application.answers,
                    'currentSituation.currentSituationRepeater',
                    [],
                  ) ?? []

                const status =
                  getValueViaPath<EmploymentStatus>(
                    application.answers,
                    'currentSituation.status',
                    undefined,
                  ) ?? undefined

                if (
                  !hasDataFromCurrentStatus(application.answers, index) ||
                  status === EmploymentStatus.UNEMPLOYED
                ) {
                  return ''
                }

                return repeaterJobs[index]?.title || ''
              },
            },
            percentage: {
              component: 'input',
              label:
                employmentMessages.employmentHistory.labels.lastJobPercentage,
              width: 'half',
              type: 'number',
              suffix: '%',
              required: true,
              condition: (application, _activeField, index) => {
                return (
                  !hasDataFromCurrentStatus(application.answers, index) ||
                  (hasEmployer(application.answers) &&
                    hasDataFromCurrentStatusItem(
                      application.answers,
                      index,
                      'percentage',
                    ))
                )
              },
              readonly: (application, _, index) => {
                return hasDataFromCurrentStatusItem(
                  application.answers,
                  index,
                  'percentage',
                )
              },
              defaultValue: (
                application: Application,
                _activeField: Record<string, string>,
                index: number,
              ) => {
                return getDefaultFromCurrentStatus(
                  application.answers,
                  index,
                  'percentage',
                )
              },
            },
            startDate: {
              component: 'date',
              label:
                employmentMessages.employmentHistory.labels.lastJobStartDate,
              width: 'half',
              required: true,
              condition: (application, _activeField, index) => {
                return (
                  !hasDataFromCurrentStatus(application.answers, index) ||
                  (isEmployedPartTime(application.answers) &&
                    hasDataFromCurrentStatusItem(
                      application.answers,
                      index,
                      'startDate',
                    ))
                )
              },
              readonly: (application, _, index) => {
                return hasDataFromCurrentStatusItem(
                  application.answers,
                  index,
                  'startDate',
                )
              },
              defaultValue: (
                application: Application,
                _activeField: Record<string, string>,
                index: number,
              ) => {
                return getDefaultFromCurrentStatus(
                  application.answers,
                  index,
                  'startDate',
                )
              },
            },
            predictedEndDate: {
              component: 'date',
              required: true,
              label: employmentMessages.employmentHistory.labels.lastJobEndDate,
              width: 'half',
              condition: (application, _activeField, index) => {
                if (hasDataFromCurrentStatus(application.answers, index)) {
                  return isEmployed(application.answers)
                }

                return false
              },
              readonly: (application, _, index) => {
                return hasDataFromCurrentStatusItem(
                  application.answers,
                  index,
                  'predictedEndDate',
                )
              },
              defaultValue: (
                application: Application,
                _activeField: Record<string, string>,
                index: number,
              ) => {
                return getDefaultFromCurrentStatus(
                  application.answers,
                  index,
                  'predictedEndDate',
                )
              },
            },
            endDate: {
              component: 'date',
              required: true,
              label:
                employmentMessages.employmentHistory.labels.lastOldJobEndDate,
              width: 'half',
              maxDate: new Date(),
              condition: (application, _activeField, index) => {
                return !hasDataFromCurrentStatus(application.answers, index)
              },
            },
          },
        }),

        buildFieldsRepeaterField({
          id: 'employmentHistory.lastJobs',
          marginTop: 0,
          minRows: 0,
          formTitle: (index, application) => {
            const repeaterJobs =
              getValueViaPath<CurrentEmploymentInAnswers[]>(
                application.answers,
                'currentSituation.currentSituationRepeater',
                [],
              ) ?? []
            return {
              ...employmentMessages.employmentHistory.labels.lastJobRepeater,
              values: {
                value: repeaterJobs.length + index + 1,
              },
            }
          },
          formTitleNumbering: 'none',
          formTitleVariant: 'h5',
          fields: {
            nationalIdWithName: {
              component: 'select',
              required: true,
              label:
                employmentMessages.employmentHistory.labels.lastJobRepeater,
              options: (application) => getRskOptions(application),
            },
            employer: {
              component: 'nationalIdWithName',
              required: true,
              searchPersons: true,
              searchCompanies: true,
              condition: (_, activeField) => {
                const nationalIdChosen = activeField?.nationalIdWithName
                  ? activeField?.nationalIdWithName
                  : ''

                return nationalIdChosen === '-' || activeField === undefined
              },
            },
            title: {
              component: 'select',
              label: employmentMessages.employmentHistory.labels.lastJobTitle,
              width: 'half',
              required: true,
              options: (application, _activeField, locale) =>
                getJobCodeOptions(application, locale),
            },
            percentage: {
              component: 'input',
              label:
                employmentMessages.employmentHistory.labels.lastJobPercentage,
              width: 'half',
              type: 'number',
              suffix: '%',
              max: 100,
              required: true,
            },
            startDate: {
              component: 'date',
              label:
                employmentMessages.employmentHistory.labels.lastJobStartDate,
              width: 'half',
              required: true,
            },
            endDate: {
              component: 'date',
              required: true,
              label:
                employmentMessages.employmentHistory.labels.lastOldJobEndDate,
              width: 'half',
              maxDate: new Date(),
            },
          },
        }),
        buildRadioField({
          id: 'employmentHistory.hasWorkedEes',
          title: employmentMessages.employmentHistory.labels.radioEesLabel,
          width: 'half',
          options: [
            {
              value: YES,
              label: coreMessages.radioYes,
            },
            {
              value: NO,
              label: coreMessages.radioNo,
            },
          ],
        }),
        buildAlertMessageField({
          id: 'employmentHistoryEesAlertMessage',
          message:
            employmentMessages.employmentHistory.labels.eesAlertInformation,
          alertType: 'info',
          doesNotRequireAnswer: true,
          condition: (answers: FormValue) => {
            const hasWorkedEes = getValueViaPath<string>(
              answers,
              'employmentHistory.hasWorkedEes',
              '',
            )

            return hasWorkedEes === YES
          },
        }),
      ],
    }),
  ],
})
