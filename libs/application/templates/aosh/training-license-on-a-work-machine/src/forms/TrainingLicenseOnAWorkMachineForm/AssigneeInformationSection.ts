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
  isContractor,
  isSameAsApplicant,
} from '../../utils'
import { TrainingLicenseOnAWorkMachineAnswers } from '../../lib/dataSchema'
import { filterWorkMachineOptions } from '../../utils/filterWorkMachineOptions'
import { Application } from '@island.is/application/types'

export const assigneeInformationSection = buildSection({
  id: 'assigneeInformationSection',
  title: assigneeInformation.general.sectionTitle,
  condition: (answers) => !isContractor(answers),
  children: [
    buildMultiField({
      id: 'assigneeInformationMultiField',
      title: assigneeInformation.general.title,
      description: assigneeInformation.general.description,
      children: [
        buildTableRepeaterField({
          id: 'assigneeInformation',
          addItemButtonText: assigneeInformation.labels.tableButtonText,
          marginTop: 0,
          table: {
            header: [
              assigneeInformation.labels.company,
              assigneeInformation.labels.assignee,
              assigneeInformation.labels.workMachine,
            ],
            rows: ['company.name', 'assignee.name', 'workMachine'],
          },
          initActiveFieldIfEmpty: true,
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
                `assigneeInformation[${index}].company.name`,
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
                `assigneeInformation[${index}].assignee.name`,
              ],
            },
            isSameAsApplicant: {
              component: 'hiddenInput',
              defaultValue: (
                application: Application,
                activeField?: Record<string, string>,
              ) => {
                return isSameAsApplicant(application.answers, activeField)
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
                    .map((item, index) => {
                      return {
                        value:
                          certificateOfTenure
                            ?.filter(
                              (item) => !item.isContractor.includes('yes'),
                            )
                            .filter(
                              (newItem) =>
                                newItem.machineNumber === item.machineNumber,
                            ).length > 1
                            ? `${item.machineNumber} ${index}`
                            : item.machineNumber,
                        label: item.machineNumber,
                      }
                    }) ?? []
                )
              },
              filterOptions: (options, answers, index) =>
                filterWorkMachineOptions(options, answers, index),
            },
            alertMessage: {
              component: 'alertMessage',
              alertType: 'error',
              message: assigneeInformation.labels.isSameAsApplicantAlert,
              marginBottom: 0,
              marginTop: 0,
              condition: (application, activeField) => {
                return isSameAsApplicant(application.answers, activeField)
              },
            },
          },
        }),
        buildAlertMessageField({
          id: 'assigneeInformation.alertValidation',
          message: (application) => {
            const missingWorkMachines = getMissingWorkMachines(
              application.answers,
            )
            const invalidWorkMachines = getInvalidWorkMachines(
              application.answers,
            )

            const hasMissingWorkMachinesError = missingWorkMachines.length > 0
            const hasInvalidWorkMachinesError = invalidWorkMachines.length > 0

            if (hasMissingWorkMachinesError)
              return {
                ...assigneeInformation.labels.missingWorkMachineAlert,
                values: {
                  value: missingWorkMachines.join(', '),
                },
              }
            else if (hasInvalidWorkMachinesError)
              return {
                ...assigneeInformation.labels.invalidWorkMachineAlert,
                values: {
                  value: invalidWorkMachines.join(', '),
                },
              }
            else return ''
          },
          doesNotRequireAnswer: true,
          alertType: 'error',
          condition: (answers) => {
            const missingWorkMachines = getMissingWorkMachines(answers)
            const invalidWorkMachines = getInvalidWorkMachines(answers)

            const hasMissingWorkMachinesError = missingWorkMachines.length > 0
            const hasInvalidWorkMachinesError = invalidWorkMachines.length > 0

            return hasMissingWorkMachinesError || hasInvalidWorkMachinesError
          },
          shouldBlockInSetBeforeSubmitCallback: true,
        }),
      ],
    }),
  ],
})
