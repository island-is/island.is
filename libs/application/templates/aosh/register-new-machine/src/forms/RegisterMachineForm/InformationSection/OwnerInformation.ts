import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildPhoneField,
  buildRadioField,
  buildSelectField,
  buildCustomField,
  buildAlertMessageField,
  NO,
  YES,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { FormValue } from '@island.is/application/types'
import {
  isOwnerOtherThanImporter,
  doOwnerAndImporterHaveSameNationalId,
} from '../../../utils'
import { postalCodes } from '@island.is/shared/utils'

export const OwnerInformationSubSection = buildSubSection({
  id: 'ownerInformation',
  title: information.labels.owner.sectionTitle,
  children: [
    buildMultiField({
      id: 'ownerInformationMultiField',
      title: information.labels.owner.title,
      description: information.labels.owner.description,
      children: [
        buildRadioField({
          id: 'ownerInformation.isOwnerOtherThanImporter',
          title: information.labels.owner.isOwnerOtherThenImporter,
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
          id: 'ownerInformation.owner.name',
          title: information.labels.owner.name,
          width: 'half',
          required: true,
          maxLength: 100,
          condition: (answer: FormValue) => isOwnerOtherThanImporter(answer),
        }),
        buildTextField({
          id: 'ownerInformation.owner.nationalId',
          title: information.labels.owner.nationalId,
          width: 'half',
          required: true,
          format: '######-####',
          condition: (answer: FormValue) => isOwnerOtherThanImporter(answer),
        }),
        buildTextField({
          id: 'ownerInformation.owner.address',
          title: information.labels.owner.address,
          width: 'half',
          required: true,
          maxLength: 50,
          condition: (answer: FormValue) => isOwnerOtherThanImporter(answer),
        }),
        buildSelectField({
          id: 'ownerInformation.owner.postCode',
          title: information.labels.importer.postCode,
          width: 'half',
          required: true,
          options: () => {
            return postalCodes.map((code) => {
              return { value: `${code}`, label: `${code}` }
            })
          },
          condition: (answer: FormValue) => isOwnerOtherThanImporter(answer),
        }),
        buildPhoneField({
          id: 'ownerInformation.owner.phone',
          title: information.labels.owner.phone,
          width: 'half',
          required: true,
          condition: (answer: FormValue) => isOwnerOtherThanImporter(answer),
        }),
        buildTextField({
          id: 'ownerInformation.owner.email',
          title: information.labels.owner.email,
          width: 'half',
          variant: 'email',
          required: true,
          maxLength: 250,
          condition: (answer: FormValue) => isOwnerOtherThanImporter(answer),
        }),
        buildAlertMessageField({
          id: 'ownerInformation.alertMessage',
          alertType: 'warning',
          title: information.labels.owner.alertTitle,
          message: information.labels.owner.alertMessage,
          condition: (answer: FormValue) =>
            doOwnerAndImporterHaveSameNationalId(answer),
        }),
        buildCustomField(
          {
            id: 'ownerInformation.custom',
            title: '',
            component: 'ChangeAnswers',
          },
          {
            sectionName: 'operatorInformation',
            questionName: 'hasOperator',
            person: 'operator',
          },
        ),
      ],
    }),
  ],
})
