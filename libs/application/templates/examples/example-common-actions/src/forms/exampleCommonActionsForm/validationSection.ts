import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { RadioValidationExampleEnum } from '../../utils/types'

export const validationSection = buildSection({
  id: 'validationSubsection',
  title: 'Validation',
  children: [
    buildMultiField({
      id: 'validationMultiField',
      title: 'Validation',
      children: [
        buildDescriptionField({
          id: 'validationDescriptionField',
          description: 'adsf',
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'validationDescriptionField2',
          description:
            'All fields on this page have validation that must be filled out to continue',
        }),
        buildTextField({
          id: 'validation.validationTextField',
          title: 'Must be 3 characters or more',
          required: true, // Adds the red star to the field
        }),
        buildDescriptionField({
          id: 'validation.validationDescriptionField3',
          description: 'adsf',
          marginTop: 4,
        }),
        buildRadioField({
          id: 'validation.validationRadioField',
          options: [
            { label: 'Option 1', value: RadioValidationExampleEnum.OPTION_1 },
            { label: 'Option 2', value: RadioValidationExampleEnum.OPTION_2 },
            { label: 'Option 3', value: RadioValidationExampleEnum.OPTION_3 },
          ],
        }),
      ],
    }),
  ],
})
