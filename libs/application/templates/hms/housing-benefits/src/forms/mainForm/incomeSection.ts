import {
  buildCheckboxField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import * as m from '../../lib/messages'

const incomeOtherIncomeYes = (answers: FormValue) =>
  getValueViaPath<string>(answers, 'incomeHasOtherIncome') === YES

const contractorIncomeSelected = (answers: FormValue) =>
  incomeOtherIncomeYes(answers) &&
  (
    getValueViaPath<string[]>(answers, 'incomeContractorCheckbox') ?? []
  ).includes(YES)

const foreignIncomeSelected = (answers: FormValue) =>
  incomeOtherIncomeYes(answers) &&
  (getValueViaPath<string[]>(answers, 'incomeForeignCheckbox') ?? []).includes(
    YES,
  )

const otherIncomeSelected = (answers: FormValue) =>
  incomeOtherIncomeYes(answers) &&
  (getValueViaPath<string[]>(answers, 'incomeOtherCheckbox') ?? []).includes(
    YES,
  )

const incomeRadioClearChildren = [
  'incomeContractorCheckbox',
  'incomeForeignCheckbox',
  'incomeOtherCheckbox',
  'incomeContractorDescription',
  'incomeContractorFiles',
  'incomeForeignDescription',
  'incomeForeignFiles',
  'incomeOtherDescription',
  'incomeOtherFiles',
]

export const incomeSection = buildSection({
  id: 'incomeSection',
  title: m.draftMessages.incomeSection.title,
  children: [
    buildMultiField({
      id: 'incomeMultiField',
      title: m.draftMessages.incomeSection.multiFieldTitle,
      description: m.draftMessages.incomeSection.multiFieldDescription,
      children: [
        buildRadioField({
          id: 'incomeHasOtherIncome',
          title: m.draftMessages.incomeSection.hasOtherIncomeQuestion,
          titleVariant: 'h3',
          marginBottom: 4,
          required: true,
          clearOnChange: incomeRadioClearChildren,
          options: [
            {
              value: YES,
              label: m.draftMessages.incomeSection.optionYes,
            },
            {
              value: NO,
              label: m.draftMessages.incomeSection.optionNo,
            },
          ],
        }),
        buildDescriptionField({
          id: 'incomeOtherIncomeTypesIntro',
          title: m.draftMessages.incomeSection.otherIncomeTypesTitle,
          titleVariant: 'h3',
          marginBottom: 2,
          condition: incomeOtherIncomeYes,
        }),
        buildCheckboxField({
          id: 'incomeContractorCheckbox',
          condition: incomeOtherIncomeYes,
          clearOnChange: [
            'incomeContractorDescription',
            'incomeContractorFiles',
          ],
          options: [
            {
              value: YES,
              label: m.draftMessages.incomeSection.checkboxContractor,
            },
          ],
          marginBottom: 2,
        }),
        buildTextField({
          id: 'incomeContractorDescription',
          title: m.draftMessages.incomeSection.contractorDescriptionTitle,
          description:
            m.draftMessages.incomeSection.contractorDescriptionDescription,
          variant: 'textarea',
          rows: 4,
          marginBottom: 2,
          condition: contractorIncomeSelected,
        }),
        buildFileUploadField({
          id: 'incomeContractorFiles',
          title: m.draftMessages.incomeSection.contractorFilesTitle,
          titleVariant: 'h3',
          description: m.draftMessages.incomeSection.contractorFilesDescription,
          uploadAccept: '.pdf,.doc,.docx',
          uploadMultiple: true,
          marginBottom: 4,
          condition: contractorIncomeSelected,
        }),
        buildCheckboxField({
          id: 'incomeForeignCheckbox',
          condition: incomeOtherIncomeYes,
          clearOnChange: ['incomeForeignDescription', 'incomeForeignFiles'],
          options: [
            {
              value: YES,
              label: m.draftMessages.incomeSection.checkboxForeign,
            },
          ],
          marginBottom: 2,
        }),
        buildTextField({
          id: 'incomeForeignDescription',
          title: m.draftMessages.incomeSection.foreignDescriptionTitle,
          description:
            m.draftMessages.incomeSection.foreignDescriptionDescription,
          variant: 'textarea',
          rows: 4,
          marginBottom: 2,
          condition: foreignIncomeSelected,
        }),
        buildFileUploadField({
          id: 'incomeForeignFiles',
          title: m.draftMessages.incomeSection.foreignFilesTitle,
          titleVariant: 'h3',
          description: m.draftMessages.incomeSection.foreignFilesDescription,
          uploadAccept: '.pdf,.doc,.docx',
          uploadMultiple: true,
          marginBottom: 4,
          condition: foreignIncomeSelected,
        }),
        buildCheckboxField({
          id: 'incomeOtherCheckbox',
          condition: incomeOtherIncomeYes,
          clearOnChange: ['incomeOtherDescription', 'incomeOtherFiles'],
          options: [
            {
              value: YES,
              label: m.draftMessages.incomeSection.checkboxOther,
            },
          ],
          marginBottom: 2,
        }),
        buildTextField({
          id: 'incomeOtherDescription',
          title: m.draftMessages.incomeSection.otherDescriptionTitle,
          description:
            m.draftMessages.incomeSection.otherDescriptionDescription,
          variant: 'textarea',
          rows: 4,
          marginBottom: 2,
          condition: otherIncomeSelected,
        }),
        buildFileUploadField({
          id: 'incomeOtherFiles',
          title: m.draftMessages.incomeSection.otherFilesTitle,
          titleVariant: 'h3',
          description: m.draftMessages.incomeSection.otherFilesDescription,
          uploadAccept: '.pdf,.doc,.docx',
          uploadMultiple: true,
          condition: otherIncomeSelected,
        }),
      ],
    }),
  ],
})
