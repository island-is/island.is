import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildPhoneField,
  buildRadioField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { FormValue, NO, YES } from '@island.is/application/types'
import { hasOperator } from '../../../utils/hasOperator'

export const OperatorInformationSubSection = buildSubSection({
  id: 'operatorInformation',
  title: information.labels.operator.sectionTitle,
  children: [
    buildMultiField({
      id: 'operatorInformationMultiField',
      title: information.labels.operator.title,
      description: information.labels.operator.description,
      children: [
        buildRadioField({
          id: 'operatorInformation.hasOperator',
          title: information.labels.operator.hasOperator,
          width: 'half',
          defaultValue: NO,
          options: [
            {
              value: NO,
              label: information.labels.radioButtons.radioOptionNo,
            },
            {
              value: YES,
              label: information.labels.radioButtons.radioOptionYes,
            },
          ],
        }),
        buildTextField({
          id: 'operatorInformation.operator.name',
          title: information.labels.operator.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          condition: (answer: FormValue) => hasOperator(answer),
        }),
        buildTextField({
          id: 'operatorInformation.operator.nationalId',
          title: information.labels.operator.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          condition: (answer: FormValue) => hasOperator(answer),
        }),
        buildTextField({
          id: 'operatorInformation.operator.address',
          title: information.labels.operator.address,
          width: 'half',
          condition: (answer: FormValue) => hasOperator(answer),
        }),
        buildTextField({
          id: 'operatorInformation.operator.postCode',
          title: information.labels.operator.postCode,
          width: 'half',
          condition: (answer: FormValue) => hasOperator(answer),
        }),
        buildPhoneField({
          id: 'operatorInformation.operator.phone',
          title: information.labels.operator.phone,
          width: 'half',
          required: true,
          condition: (answer: FormValue) => hasOperator(answer),
        }),
        buildTextField({
          id: 'operatorInformation.operator.email',
          title: information.labels.operator.email,
          width: 'half',
          variant: 'email',
          condition: (answer: FormValue) => hasOperator(answer),
        }),
      ],
    }),
  ],
})
