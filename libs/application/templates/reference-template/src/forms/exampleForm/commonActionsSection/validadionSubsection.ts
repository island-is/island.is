import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { radioValidationExampleEnum } from '../../../utils/types'

export const validationSubsection = buildSubSection({
  id: 'validationSubsection',
  title: 'Validation',
  children: [
    buildMultiField({
      id: 'validationMultiField',
      title: 'Validation',
      children: [
        buildDescriptionField({
          id: 'validationDescriptionField',
          title: '',
          description: m.validationDescription,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'validationDescriptionField2',
          title: '',
          description:
            'Allir reitir á þessari síðu eru með validation sem verður að fylla út til að halda áfram',
        }),
        buildTextField({
          id: 'validation.validationTextField',
          title: 'Verður að vera 3 stafir eða meira',
          required: true, // Adds the red star to the field
        }),
        buildDescriptionField({
          id: 'validation.validationDescriptionField3',
          title: '',
          description: m.validationDescription3,
          marginTop: 4,
        }),
        buildRadioField({
          id: 'validation.validationRadioField',
          title: '',
          options: [
            { label: 'Option 1', value: radioValidationExampleEnum.OPTION_1 },
            { label: 'Option 2', value: radioValidationExampleEnum.OPTION_2 },
            { label: 'Option 3', value: radioValidationExampleEnum.OPTION_3 },
          ],
        }),
      ],
    }),
  ],
})
