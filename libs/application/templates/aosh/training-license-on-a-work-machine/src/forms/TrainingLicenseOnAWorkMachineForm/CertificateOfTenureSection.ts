import {
  buildMultiField,
  buildSection,
  getValueViaPath,
  buildTableRepeaterField,
  YES,
  buildAlertMessageField,
} from '@island.is/application/core'
import { assigneeInformation, certificateOfTenure } from '../../lib/messages'
import { setOnMachineNumberChange } from '../../utils/setOnMachineNumberChange'
import { formatDate } from '../../utils'
import { Application } from '@island.is/api/schema'
import { TrainingLicenseOnAWorkMachine } from '../..'

export const certificateOfTenureSection = buildSection({
  id: 'certificateOfTenureSection',
  title: certificateOfTenure.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'certificateOfTenureMultiField',
      title: certificateOfTenure.general.title,
      description: certificateOfTenure.general.description,
      children: [
        buildTableRepeaterField({
          id: 'certificateOfTenure',
          addItemButtonText:
            certificateOfTenure.labels.registerMachineButtonText,
          marginTop: 0,
          table: {
            format: {
              practicalRight: (value) => {
                return typeof value === 'string' ? value[0] : value
              },
            },
            header: [
              certificateOfTenure.labels.machineNumber,
              certificateOfTenure.labels.machineType,
              certificateOfTenure.labels.practicalRightHeader,
              certificateOfTenure.labels.dateHeader,
              certificateOfTenure.labels.tenureInHoursHeader,
            ],
            rows: [
              'machineNumber',
              'machineType',
              'practicalRight',
              'date',
              'tenureInHours',
            ],
          },
          initActiveFieldIfEmpty: true,
          fields: {
            machineNumber: {
              component: 'input',
              label: certificateOfTenure.labels.machineNumber,
              width: 'half',
              clearOnChange: (index) => [
                `certificateOfTenure[${index}].machineType`,
                `certificateOfTenure[${index}].practicalRight`,
              ],
              setOnChange: async (
                value,
                application,
                index,
                _activeField,
                apolloClient,
                lang,
              ) =>
                setOnMachineNumberChange(
                  value,
                  application,
                  index,
                  apolloClient,
                  lang,
                ),
            },
            machineType: {
              component: 'input',
              label: certificateOfTenure.labels.machineType,
              width: 'half',
              readonly: true,
            },
            practicalRight: {
              component: 'input',
              label: certificateOfTenure.labels.practicalRight,
              readonly: true,
            },
            machineNumberAlert: {
              component: 'alertMessage',
              alertType: 'warning',
              condition: (_, activeField) => {
                return (
                  (!!activeField?.unknownPracticalRight ||
                    !!activeField?.wrongPracticalRight ||
                    !!activeField?.wrongPracticalRightWithInfo ||
                    (!!activeField?.unknownMachineType &&
                      !activeField?.unknownPracticalRight &&
                      !activeField?.alreadyHaveTrainingLicense) ||
                    !!activeField?.alreadyHaveTrainingLicense) ??
                  false
                )
              },
              message: (_, activeField) => {
                if (activeField?.unknownPracticalRight) {
                  return certificateOfTenure.labels.unknownPracticalRight
                } else if (activeField?.wrongPracticalRight) {
                  return certificateOfTenure.labels.wrongPracticalRight
                } else if (activeField?.wrongPracticalRightWithInfo) {
                  return certificateOfTenure.labels.wrongPracticalRightWithInfo
                } else if (
                  activeField?.unknownMachineType &&
                  !activeField?.unknownPracticalRight &&
                  !activeField?.alreadyHaveTrainingLicense
                ) {
                  return certificateOfTenure.labels.unknownMachineType
                } else if (activeField?.alreadyHaveTrainingLicense) {
                  return certificateOfTenure.labels.alreadyHaveTrainingLicense
                } else {
                  return ''
                }
              },
              marginTop: 0,
              marginBottom: 0,
            },
            machineTypeDoesNotMatchAlert: {
              component: 'alertMessage',
              alertType: 'error',
              marginTop: 0,
              condition: (_, activeField) => {
                return !!activeField?.machineTypeDoesNotMatch
              },
              message: certificateOfTenure.labels.machineTypeDoesNotMatchAlert,
            },
            dateFrom: {
              component: 'date',
              label: certificateOfTenure.labels.dateFrom,
              width: 'half',
              placeholder: certificateOfTenure.labels.datePlaceholder,
              maxDate: (_, activeField) => {
                const dateTo =
                  (activeField &&
                    getValueViaPath<string>(activeField, 'dateTo')) ||
                  new Date()
                return new Date(
                  new Date(dateTo).setDate(new Date(dateTo).getDate() - 1),
                )
              },
            },
            dateTo: {
              component: 'date',
              label: certificateOfTenure.labels.dateTo,
              width: 'half',
              placeholder: certificateOfTenure.labels.datePlaceholder,
              minDate: (_, activeField) => {
                const dateFrom =
                  activeField &&
                  getValueViaPath<string>(activeField, 'dateFrom')
                return dateFrom
                  ? new Date(
                      new Date(dateFrom).setDate(
                        new Date(dateFrom).getDate() + 1,
                      ),
                    )
                  : new Date('1900-01-01')
              },
              maxDate: new Date(),
            },
            tenureInHours: {
              component: 'input',
              type: 'number',
              label: certificateOfTenure.labels.tenureInHours,
              width: 'half',
            },
            isContractor: {
              component: 'checkbox',
              large: false,
              backgroundColor: 'white',
              options: [
                {
                  value: YES,
                  label: assigneeInformation.labels.isContractor,
                },
              ],
            },
            isContractorAlert: {
              component: 'alertMessage',
              alertType: 'info',
              marginTop: 0,
              condition: (_, activeField) => {
                return activeField?.isContractor?.includes('yes') ?? false
              },
              message: assigneeInformation.labels.isContractorAlert,
            },
            unknownPracticalRight: {
              component: 'hiddenInput',
            },
            wrongPracticalRight: {
              component: 'hiddenInput',
            },
            wrongPracticalRightWithInfo: {
              component: 'hiddenInput',
            },
            unknownMachineType: {
              component: 'hiddenInput',
            },
            alreadyHaveTrainingLicense: {
              component: 'hiddenInput',
            },
            machineTypeDoesNotMatch: {
              component: 'hiddenInput',
            },
            date: {
              component: 'hiddenInput',
              defaultValue: (
                _application: Application,
                activeField: Record<string, string>,
              ) => {
                const dateFrom = activeField?.dateFrom
                  ? formatDate(activeField?.dateFrom)
                  : ''
                const dateTo = activeField?.dateTo
                  ? formatDate(activeField?.dateTo)
                  : ''
                return `${dateFrom} - ${dateTo}`
              },
            },
          },
        }),
        buildAlertMessageField({
          id: 'certificateOfTenure.alertValidation',
          title: certificateOfTenure.labels.validationErrorTitle,
          message: (application) => {
            const certificateOfTenureList = getValueViaPath<
              TrainingLicenseOnAWorkMachine['certificateOfTenure']
            >(application.answers, 'certificateOfTenure')
            const totalTenureInHours = certificateOfTenureList?.reduce(
              (sum, tenure) => sum + (parseInt(tenure.tenureInHours, 10) || 0),
              0,
            )

            const hasNoCertificatesError =
              !certificateOfTenureList || certificateOfTenureList.length === 0
            const hasMinTenureInHoursError = !!(
              totalTenureInHours && totalTenureInHours < 1000
            )

            if (hasNoCertificatesError)
              return certificateOfTenure.labels.noCertificatesError
            else if (hasMinTenureInHoursError)
              return certificateOfTenure.labels.minTenureInHoursError
            else return ''
          },
          doesNotRequireAnswer: true,
          alertType: 'error',
          condition: (answers) => {
            const certificateOfTenureList = getValueViaPath<
              TrainingLicenseOnAWorkMachine['certificateOfTenure']
            >(answers, 'certificateOfTenure')
            const totalTenureInHours = certificateOfTenureList?.reduce(
              (sum, tenure) => sum + (parseInt(tenure.tenureInHours, 10) || 0),
              0,
            )

            const hasNoCertificatesError =
              !certificateOfTenureList || certificateOfTenureList.length === 0
            const hasMinTenureInHoursError = !!(
              totalTenureInHours && totalTenureInHours < 1000
            )

            return hasNoCertificatesError || hasMinTenureInHoursError
          },
          shouldBlockInSetBeforeSubmitCallback: true,
        }),
      ],
    }),
  ],
})
