import {
  buildMultiField,
  buildSection,
  buildCheckboxField,
  YES,
  buildNationalIdWithNameField,
  buildAlertMessageField,
  buildCustomField,
  buildTableRepeaterField,
  getValueViaPath,
} from '@island.is/application/core'
import { assigneeInformation } from '../../lib/messages'
import { isContractor, isSameAsApplicant } from '../../utils'
import {
  CertificateOfTenure,
  TrainingLicenseOnAWorkMachineAnswers,
} from '../../lib/dataSchema'

export const assigneeInformationSection = buildSection({
  id: 'assigneeInformationSection',
  title: assigneeInformation.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'assigneeInformationMultiField',
      title: assigneeInformation.general.title,
      description: assigneeInformation.general.description,
      children: [
        buildCheckboxField({
          id: 'assigneeInformation.isContractor',
          title: '',
          options: [
            {
              value: YES,
              label: assigneeInformation.labels.isContractor,
            },
          ],
        }),
        buildTableRepeaterField({
          id: 'assigneeInformation.companyAndAssignee',
          addItemButtonText: 'Skrá staðfestingaraðila',
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
            },
            workMachine: {
              component: 'select',
              label: assigneeInformation.labels.workMachine,
              isMulti: true,
              options: (application, activeField) => {
                console.log(activeField?.workMachine, application)
                const certificateOfTenure = getValueViaPath<
                  CertificateOfTenure[]
                >(application.answers, 'certificateOfTenure')
                return (
                  certificateOfTenure?.map((item) => ({
                    value: item.machineNumber,
                    label: item.machineNumber,
                  })) ?? []
                )
              },
              filterOptions: (options, answers, index) => {
                console.log(answers)
                const validWorkMachines: string[] = []
                const assigneeInformation = getValueViaPath<
                  TrainingLicenseOnAWorkMachineAnswers['assigneeInformation']
                >(answers, 'assigneeInformation')
                assigneeInformation?.companyAndAssignee?.forEach((item, i) => {
                  if (
                    i !== index &&
                    item.workMachine?.some((machine) =>
                      options.some((option) => option.value === machine),
                    )
                  ) {
                    validWorkMachines.push(
                      ...item.workMachine.filter((machine) =>
                        options.some((option) => option.value === machine),
                      ),
                    )
                  }
                })
                console.log(validWorkMachines)
                return options.filter(
                  (x) => !validWorkMachines.includes(x.value),
                )
              },
            },
          },
          condition: (answers) => !isContractor(answers),
        }),
        // buildAlertMessageField({
        //   id: 'assigneeInformation.isSameAsApplicantAlert',
        //   title: '',
        //   message: assigneeInformation.labels.isSameAsApplicantAlert,
        //   doesNotRequireAnswer: true,
        //   alertType: 'warning',
        //   condition: (answers) =>
        //     isSameAsApplicant(answers) && !isContractor(answers),
        // }),
        buildAlertMessageField({
          id: 'assigneeInformation.isContractorAlert',
          title: '',
          message: assigneeInformation.labels.isContractorAlert,
          doesNotRequireAnswer: true,
          alertType: 'info',
          condition: isContractor,
        }),
        // buildCustomField({
        //   id: 'assigneeInformation.isSameAsApplicant',
        //   title: '',
        //   component: 'SameAsApplicantCheck',
        // }),
      ],
    }),
  ],
})
