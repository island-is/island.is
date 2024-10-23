import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { information, shared } from '../../../lib/messages'
import { FormValue, NO, YES } from '@island.is/application/types'

export const projectPurchaseSection = buildSubSection({
  id: 'projectPurchaseSection',
  title: information.labels.projectPurchase.sectionTitle,
  children: [
    buildMultiField({
      id: 'projectPurchase',
      title: information.general.pageTitle,
      description: information.general.description,
      children: [
        buildDescriptionField({
          id: 'projectPurchase.description',
          title: information.labels.projectPurchase.descriptionField,
          titleVariant: 'h5',
        }),
        buildAlertMessageField({
          id: 'projectPurchase.alertMessage',
          title: '',
          message: information.labels.projectPurchase.alertMessage,
          alertType: 'info',
          doesNotRequireAnswer: true,
        }),
        buildRadioField({
          id: 'projectPurchase.radio',
          width: 'half',
          defaultValue: NO,
          title: information.labels.projectPurchase.radioTitle,
          options: [
            {
              value: YES,
              label: shared.options.yes,
            },
            {
              value: NO,
              label: shared.options.no,
            },
          ],
        }),
        buildTextField({
          id: 'projectPurchase.nationalId',
          title: information.labels.company.nationalId,
          backgroundColor: 'white',
          width: 'half',
          required: true,
          format: '######-####',
          doesNotRequireAnswer: true,
          condition: (answer: FormValue) =>
            getValueViaPath(answer, 'projectPurchase.radio') === YES,
        }),
        buildTextField({
          id: 'projectPurchase.name',
          title: information.labels.projectPurchase.name,
          backgroundColor: 'white',
          width: 'half',
          required: true,
          doesNotRequireAnswer: true,
          condition: (answer: FormValue) =>
            getValueViaPath(answer, 'projectPurchase.radio') === YES,
        }),
      ],
    }),
  ],
})
