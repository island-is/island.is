import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  YES,
  NO,
} from '@island.is/application/core'
import { application, workMachine } from '../../../lib/messages'
import {
  isAgricultureAccident,
  isGeneralWorkplaceAccident,
  isSportAccidentAndEmployee,
} from '../../../utils/occupationUtils'

// Workmachine information only applicable to generic workplace accidents
export const workMachineSubSection = buildSubSection({
  id: 'workMachine.section',
  title: workMachine.general.sectionTitle,
  condition: (formValue) =>
    isGeneralWorkplaceAccident(formValue) ||
    isAgricultureAccident(formValue) ||
    isSportAccidentAndEmployee(formValue),
  children: [
    buildMultiField({
      id: 'workMachine',
      title: workMachine.general.workMachineRadioTitle,
      description: '',
      children: [
        buildRadioField({
          id: 'workMachineRadio',
          backgroundColor: 'blue',
          width: 'half',
          required: true,
          options: [
            { value: YES, label: application.general.yesOptionLabel },
            { value: NO, label: application.general.noOptionLabel },
          ],
        }),
      ],
    }),
    buildMultiField({
      id: 'workMachine.description',
      title: workMachine.general.subSectionTitle,
      condition: (formValue) => formValue.workMachineRadio === YES,
      children: [
        buildTextField({
          id: 'workMachine.descriptionOfMachine',
          title: workMachine.labels.descriptionOfMachine,
          placeholder: workMachine.placeholder.descriptionOfMachine,
          backgroundColor: 'blue',
          rows: 4,
          variant: 'textarea',
          required: true,
          maxLength: 2000,
        }),
      ],
    }),
  ],
})
