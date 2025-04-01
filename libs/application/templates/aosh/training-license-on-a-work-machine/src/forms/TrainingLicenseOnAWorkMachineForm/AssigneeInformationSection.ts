import {
  buildMultiField,
  buildSection,
  buildCheckboxField,
  YES,
  buildNationalIdWithNameField,
  buildAlertMessageField,
  buildCustomField,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { assigneeInformation } from '../../lib/messages'
import { isContractor, isSameAsApplicant } from '../../utils'

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
                console.log(value)
                return `${value} - bla`
              },
            },
            header: [
              assigneeInformation.labels.company,
              assigneeInformation.labels.assignee,
              assigneeInformation.labels.workMachine,
            ],
            // rows: ['company', 'assignee', 'workMachine'],
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
              setOnChange: async (index, value) => {
                console.log(value)
                return []
              },
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
              component: 'input',
              label: assigneeInformation.labels.workMachine,
            },
          },
          condition: (answers) => !isContractor(answers),
        }),
        // buildNationalIdWithNameField({
        //   id: 'assigneeInformation.company',
        //   title: '',
        //   customNationalIdLabel: assigneeInformation.labels.companyNationalId,
        //   customNameLabel: assigneeInformation.labels.companyName,
        //   searchCompanies: true,
        //   searchPersons: false,
        //   required: true,
        //   condition: (answers) => !isContractor(answers),
        // }),
        // buildNationalIdWithNameField({
        //   id: 'assigneeInformation.assignee',
        //   title: '',
        //   customNationalIdLabel: assigneeInformation.labels.assigneeNationalId,
        //   customNameLabel: assigneeInformation.labels.assigneeName,
        //   emailLabel: assigneeInformation.labels.assigneeEmail,
        //   phoneLabel: assigneeInformation.labels.assigneePhone,
        //   showEmailField: true,
        //   showPhoneField: true,
        //   emailRequired: true,
        //   phoneRequired: true,
        //   searchCompanies: false,
        //   searchPersons: true,
        //   required: true,
        //   condition: (answers) => !isContractor(answers),
        // }),
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
