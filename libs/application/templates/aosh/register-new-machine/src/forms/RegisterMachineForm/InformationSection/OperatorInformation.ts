import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildPhoneField,
  buildRadioField,
  buildDescriptionField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { FormValue, NO, YES } from '@island.is/application/types'
import { hasOperator } from '../../../utils/hasOperator'

export const OperatorInformationSubSection = buildSubSection({
  id: 'operatorInformation',
  title: information.labels.importer.sectionTitle,
  children: [
    buildMultiField({
      id: 'operatorInformationMultiField',
      title: information.labels.importer.title,
      description: information.labels.importer.description,
      children: [
        buildDescriptionField({
          id: 'operatorInformation.description',
          title: information.labels.importer.isOwnerOtherThenImporter,
          marginTop: 4,
          titleVariant: 'h5',
        }),
        buildRadioField({
          id: 'operatorInformation.hasOperator',
          title: '',
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
          title: information.labels.importer.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          condition: (answer: FormValue) => hasOperator(answer),
        }),
        buildTextField({
          id: 'operatorInformation.operator.nationalId',
          title: information.labels.importer.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          condition: (answer: FormValue) => hasOperator(answer),
        }),
        buildTextField({
          id: 'operatorInformation.operator.address',
          title: information.labels.importer.address,
          width: 'half',
          condition: (answer: FormValue) => hasOperator(answer),
        }),
        buildTextField({
          id: 'operatorInformation.operator.postCode',
          title: information.labels.importer.postCode,
          width: 'half',
          condition: (answer: FormValue) => hasOperator(answer),
        }),
        buildPhoneField({
          id: 'operatorInformation.operator.phone',
          title: information.labels.importer.phone,
          width: 'half',
          required: true,
          condition: (answer: FormValue) => hasOperator(answer),
        }),
        buildTextField({
          id: 'operatorInformation.operator.email',
          title: information.labels.importer.email,
          width: 'half',
          variant: 'email',
          condition: (answer: FormValue) => hasOperator(answer),
        }),
      ],
    }),
  ],
})
