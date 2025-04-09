import {
  buildMultiField,
  buildSection,
  buildAlertMessageField,
  buildTableRepeaterField,
  getValueViaPath,
} from '@island.is/application/core'
import { assigneeInformation } from '../../lib/messages'
import {
  getInvalidWorkMachines,
  getMissingWorkMachines,
  isSameAsApplicant,
} from '../../utils'
import { TrainingLicenseOnAWorkMachineAnswers } from '../../lib/dataSchema'
import { filterWorkMachineOptions } from '../../utils/filterWorkMachineOptions'

export const assigneeInformationSection = buildSection({
  id: 'assigneeInformationSection',
  title: assigneeInformation.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'assigneeInformationMultiField',
      title: assigneeInformation.general.title,
      description: assigneeInformation.general.description,
      children: [
        buildTableRepeaterField({
          id: 'assigneeInformation.companyAndAssignee',
          addItemButtonText: assigneeInformation.labels.tableButtonText,
          marginTop: 0,
          table: {
            format: {
              company: (value) => {
                return typeof value === 'string' ? value ?? '' : value['name']
              },
            },
            header: [
              assigneeInformation.labels.company,
              assigneeInformation.labels.assignee,
              assigneeInformation.labels.workMachine,
            ],
            rows: ['company', 'name', 'workMachine'],
          },
          fields: {
            company: {
              component: 'nationalIdWithName',
              searchCompanies: true,
              searchPersons: false,
              required: true,
              customNameLabel: assigneeInformation.labels.companyName,
              customNationalIdLabel:
                assigneeInformation.labels.companyNationalId,
              clearOnChange: (index) => [
                `assigneeInformation.companyAndAssignee[${index}].company.name`,
              ],
            },
            assignee: {
              component: 'nationalIdWithName',
              searchCompanies: false,
              searchPersons: true,
              showEmailField: true,
              showPhoneField: true,
              phoneRequired: true,
              emailRequired: true,
              required: true,
              phoneLabel: assigneeInformation.labels.assigneePhone,
              emailLabel: assigneeInformation.labels.assigneeEmail,
              customNameLabel: assigneeInformation.labels.assigneeName,
              customNationalIdLabel:
                assigneeInformation.labels.assigneeNationalId,
              clearOnChange: (index) => [
                `assigneeInformation.companyAndAssignee[${index}].assignee.name`,
              ],
              setOnChange: async (value, application, index) => {
                return [
                  {
                    key: `assigneeInformation.companyAndAssignee[${index}].isSameAsApplicant`,
                    value: isSameAsApplicant(
                      application.answers,
                      typeof value === 'string' ? value : '',
                    )
                      ? ''
                      : 'true',
                  },
                ]
              },
            },
            workMachine: {
              component: 'select',
              label: assigneeInformation.labels.workMachine,
              isMulti: true,
              options: (application) => {
                const certificateOfTenure = getValueViaPath<
                  TrainingLicenseOnAWorkMachineAnswers['certificateOfTenure']
                >(application.answers, 'certificateOfTenure')
                return (
                  certificateOfTenure
                    ?.filter((item) => !item.isContractor.includes('yes'))
                    .map((item) => ({
                      value: item.machineNumber,
                      label: item.machineNumber,
                    })) ?? []
                )
              },
              filterOptions: (options, answers, index) =>
                filterWorkMachineOptions(options, answers, index),
            },
            alertMessage: {
              component: 'alertMessage',
              alertType: 'warning',
              message: assigneeInformation.labels.isSameAsApplicantAlert,
              marginBottom: 0,
              marginTop: 0,
              condition: (application, activeField) => {
                return isSameAsApplicant(
                  application.answers,
                  typeof activeField?.assignee === 'string'
                    ? ''
                    : activeField?.assignee?.['nationalId'] ?? '',
                )
              },
            },
          },
        }),
        buildAlertMessageField({
          id: 'assigneeInformation.missingWorkMachineAlert',
          message: (application) => {
            return {
              ...assigneeInformation.labels.missingWorkMachineAlert,
              values: {
                value: getMissingWorkMachines(application.answers).join(', '),
              },
            }
          },
          doesNotRequireAnswer: true,
          alertType: 'error',
          condition: (answers) => {
            return getMissingWorkMachines(answers).length > 0
          },
          shouldBlockSubmitIfError: true,
        }),
        buildAlertMessageField({
          id: 'assigneeInformation.invalidWorkMachineAlert',
          message: (application) => {
            return {
              ...assigneeInformation.labels.invalidWorkMachineAlert,
              values: {
                value: getInvalidWorkMachines(application.answers).join(', '),
              },
            }
          },
          doesNotRequireAnswer: true,
          alertType: 'error',
          condition: (answers) => {
            return getInvalidWorkMachines(answers).length > 0
          },
          shouldBlockSubmitIfError: true,
        }),
      ],
    }),
  ],
})
