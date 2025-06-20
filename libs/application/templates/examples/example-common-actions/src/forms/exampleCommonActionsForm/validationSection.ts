import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
  buildSelectField,
} from '@island.is/application/core'
import {
  RadioValidationExampleEnum,
  SelectValidationExampleEnum,
} from '../../utils/types'

export const validationSection = buildSection({
  id: 'validationSubsection',
  title: 'Validation',
  children: [
    buildMultiField({
      id: 'validationMultiField',
      title: 'Validation',
      children: [
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
        buildRadioField({
          id: 'validation.validationRadioField',
          title: 'Must be selected',
          required: true,
          description:
            'Note that the radio field will not show a red star or something else to indicate that it is required so consider mentioning that in the description',
          options: [
            { label: 'Option 1', value: RadioValidationExampleEnum.OPTION_1 },
            { label: 'Option 2', value: RadioValidationExampleEnum.OPTION_2 },
            { label: 'Option 3', value: RadioValidationExampleEnum.OPTION_3 },
          ],
        }),
        buildDescriptionField({
          id: 'validation.validationDescriptionField4',
          description: `Note that should you need to validate the options of a select field while still keeping it optional 
            you must use the preprocess function to set the value to an empty string if it is not selected.
            The preprocess function is not needed if the select field is required.
            See the validationSchema.ts file for more details.`,
          marginTop: 4,
        }),
        buildSelectField({
          id: 'validation.validationSelectField',
          title: 'May be selected',
          options: [
            { label: 'Option 1', value: SelectValidationExampleEnum.OPTION_1 },
            { label: 'Option 2', value: SelectValidationExampleEnum.OPTION_2 },
            { label: 'Option 3', value: SelectValidationExampleEnum.OPTION_3 },
          ],
        }),
      ],
    }),
  ],
})
