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
  isEmployedPartTime,
  hasDataFromCurrentStatusItem,
  getDefaultFromCurrentStatus,
  hasEmployer,
  hasDataFromCurrentStatus,
  getChosenEmployerNationalId,
  getChosenEmployerName,
} from '../../../utils'
import { CurrentEmploymentInAnswers, EmploymentStatus } from '../../../shared'
import { getJobCodeOptions, getJobInfo } from '../../../utils/getJobCodeOptions'
import { getRskOptions } from '../../../utils/getRskOptions'
import { Locale } from '@island.is/shared/types'

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
        buildFieldsRepeaterField({
          id: 'employmentHistory.currentJobs',
          hideAddButton: true,
          minRows: (answers: FormValue) => {
            const currentSituationRepeater =
              getValueViaPath<Array<CurrentEmploymentInAnswers>>(
                answers,
                'currentSituation.currentSituationRepeater',
                [],
              ) ?? []

            const status =
              getValueViaPath<EmploymentStatus>(
                answers,
                'currentSituation.status',
                undefined,
              ) ?? undefined

            const minRows =
              currentSituationRepeater.length &&
              status !== EmploymentStatus.UNEMPLOYED
                ? currentSituationRepeater.length
                : 0
            return minRows
          },
          marginTop: 0,
          marginBottom: 0,
          formTitle:
            employmentMessages.employmentHistory.labels.currentJobRepeater,
          formTitleVariant: 'h5',
          fields: {
            'employer.nationalId': {
              component: 'input',
              label: coreMessages.nationalId,
              width: 'half',
              readonly: true,
              defaultValue: (
                application: Application,
                _activeField: Record<string, string>,
                index: number,
              ) => {
                const nationalId = getChosenEmployerNationalId(
                  index,
                  application,
                )
                return nationalId
              },
            },
            'employer.name': {
              component: 'input',
              label: coreMessages.name,
              width: 'half',
              readonly: true,
              defaultValue: (
                application: Application,
                _activeField: Record<string, string>,
                index: number,
              ) => {
                const name = getChosenEmployerName(index, application)

                return name
              },
            },
            jobCodeId: {
              component: 'input',
              label: employmentMessages.employmentHistory.labels.lastJobTitle,
              width: 'half',
              readonly: true,
              defaultValue: (
                application: Application,
                _activeField: Record<string, string>,
                index: number,
                locale: Locale,
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
                const jobInfo = getJobInfo(
                  application.externalData,
                  repeaterJobs[index]?.jobCodeId,
                )
                return locale === 'is' ? jobInfo?.name : jobInfo?.english
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

        buildDescriptionField({
          id: 'employmentHistoryLabel',
          title:
            employmentMessages.employmentHistory.labels.lastJobsRepeaterTitle,
          description: employmentMessages.employmentHistory.labels.lastJobLabel,
          titleVariant: 'h5',
        }),

        buildFieldsRepeaterField({
          id: 'employmentHistory.lastJobs',
          marginTop: 0,
          minRows: 1,
          formTitle:
            employmentMessages.employmentHistory.labels.lastJobRepeater,
          formTitleVariant: 'h5',
          fields: {
            nationalIdWithName: {
              component: 'select',
              required: true,
              label:
                employmentMessages.employmentHistory.labels.employerSelectLabel,
              options: (application, _, locale, formatMessage) =>
                getRskOptions(application, formatMessage),
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
            jobCodeId: {
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
              min: 1,
              required: true,
            },
            startDate: {
              component: 'date',
              label:
                employmentMessages.employmentHistory.labels.lastJobStartDate,
              width: 'half',
              required: true,
              maxDate: (_application, activeField) => {
                const endDateStr = activeField?.endDate
                return (endDateStr && new Date(endDateStr)) || undefined
              },
            },
            endDate: {
              component: 'date',
              required: true,
              label:
                employmentMessages.employmentHistory.labels.lastOldJobEndDate,
              width: 'half',
              minDate: (_application, activeField) => {
                const startDateStr = activeField?.startDate
                return (startDateStr && new Date(startDateStr)) || undefined
              },
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
