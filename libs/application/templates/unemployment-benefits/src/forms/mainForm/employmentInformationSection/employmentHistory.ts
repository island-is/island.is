import {
  buildAlertMessageField,
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildHiddenInput,
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
  isUnemployed,
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
              defaultValue: ({ application, index }) => {
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
              defaultValue: ({ application, index }) => {
                const name = getChosenEmployerName(index, application)
                return name
              },
            },
            jobCodeId: {
              component: 'input',
              label: employmentMessages.employmentHistory.labels.lastJobTitle,
              width: 'half',
              readonly: true,
              defaultValue: ({ application, index, locale }) => {
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
              max: 100,
              allowNegative: false,
              condition: ({ application, index }) => {
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
              readonly: ({ application, index }) => {
                return hasDataFromCurrentStatusItem(
                  application.answers,
                  index,
                  'percentage',
                )
              },
              defaultValue: ({ application, index }) => {
                return getDefaultFromCurrentStatus(
                  application.answers,
                  index,
                  'percentage',
                )
              },
            },
            predictedEndDate: {
              component: 'date',
              required: true,
              label: employmentMessages.employmentHistory.labels.lastJobEndDate,
              width: 'half',
              condition: ({ application, index }) => {
                if (hasDataFromCurrentStatus(application.answers, index)) {
                  return isEmployed(application.answers)
                }

                return false
              },
              readonly: ({ application, index }) => {
                return hasDataFromCurrentStatusItem(
                  application.answers,
                  index,
                  'predictedEndDate',
                )
              },
              defaultValue: ({ application, index }) => {
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
              condition: ({ application, index }) => {
                return !hasDataFromCurrentStatus(application.answers, index)
              },
            },
          },
        }),
        buildHiddenInput({
          id: 'employmentHistory.status',
          defaultValue: (application: Application) => {
            return getValueViaPath<string>(
              application.answers,
              'currentSituation.status',
            )
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
          minRows: (formValue) => {
            return isUnemployed(formValue) ? 1 : 0
          },
          formTitle:
            employmentMessages.employmentHistory.labels.lastJobRepeater,
          formTitleVariant: 'h5',
          fields: {
            nationalIdWithName: {
              component: 'select',
              isClearable: true,
              required: ({ application }) => {
                return isUnemployed(application.answers)
              },
              label:
                employmentMessages.employmentHistory.labels.employerSelectLabel,
              options: ({ application, formatMessage }) =>
                getRskOptions(application, formatMessage),
            },
            employer: {
              component: 'nationalIdWithName',
              required: ({ application }) => {
                return isUnemployed(application.answers)
              },
              searchPersons: true,
              searchCompanies: true,
              condition: ({ row: activeField }) => {
                const nationalIdChosen = activeField?.nationalIdWithName
                  ? activeField?.nationalIdWithName
                  : ''
                return nationalIdChosen === '-'
              },
            },
            jobCodeId: {
              component: 'select',
              isClearable: true,
              label: employmentMessages.employmentHistory.labels.lastJobTitle,
              width: 'half',
              required: ({ application }) => {
                return isUnemployed(application.answers)
              },
              options: ({ application, locale }) =>
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
              placeholder: '1-100%',
              allowNegative: false,
              required: ({ application }) => {
                return isUnemployed(application.answers)
              },
            },
          },
        }),
        buildRadioField({
          id: 'employmentHistory.hasWorkedEes',
          title: employmentMessages.employmentHistory.labels.radioEesLabel,
          width: 'half',
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
