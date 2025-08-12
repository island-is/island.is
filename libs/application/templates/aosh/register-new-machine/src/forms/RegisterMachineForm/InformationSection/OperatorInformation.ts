import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildPhoneField,
  buildRadioField,
  buildSelectField,
  buildAlertMessageField,
  NO,
  YES,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { FormValue } from '@island.is/application/types'
import { hasOperator } from '../../../utils/hasOperator'
import { postalCodes } from '@island.is/shared/utils'
import { doOwnerAndOperatorHaveSameNationalId } from '../../../utils'

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
          width: 'half',
          required: true,
          maxLength: 100,
          condition: (answer: FormValue) => hasOperator(answer),
        }),
        buildTextField({
          id: 'operatorInformation.operator.nationalId',
          title: information.labels.operator.nationalId,
          width: 'half',
          required: true,
          format: '######-####',
          condition: (answer: FormValue) => hasOperator(answer),
        }),
        buildTextField({
          id: 'operatorInformation.operator.address',
          title: information.labels.operator.address,
          width: 'half',
          required: true,
          maxLength: 50,
          condition: (answer: FormValue) => hasOperator(answer),
        }),
        buildSelectField({
          id: 'operatorInformation.operator.postCode',
          title: information.labels.importer.postCode,
          width: 'half',
          required: true,
          options: () => {
            return postalCodes.map((code) => {
              return { value: `${code}`, label: `${code}` }
            })
          },
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
          required: true,
          variant: 'email',
          maxLength: 250,
          condition: (answer: FormValue) => hasOperator(answer),
        }),
        buildAlertMessageField({
          id: 'operatorInformation.alertMessage',
          alertType: 'warning',
          title: information.labels.operator.alertTitle,
          message: information.labels.operator.alertMessage,
          condition: (answer: FormValue) =>
            doOwnerAndOperatorHaveSameNationalId(answer),
        }),
      ],
    }),
  ],
})
