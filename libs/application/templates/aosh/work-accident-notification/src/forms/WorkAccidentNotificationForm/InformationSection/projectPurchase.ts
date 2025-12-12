import {
  buildAlertMessageField,
  buildMultiField,
  buildNationalIdWithNameField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
  YES,
  NO,
} from '@island.is/application/core'
import { information, shared } from '../../../lib/messages'
import { FormValue } from '@island.is/application/types'

export const projectPurchaseSection = buildSubSection({
  id: 'projectPurchaseSection',
  title: information.labels.projectPurchase.sectionTitle,
  children: [
    buildMultiField({
      id: 'projectPurchase',
      title: information.labels.projectPurchase.pageTitle,
      description: information.labels.projectPurchase.pageDescription,
      children: [
        buildAlertMessageField({
          id: 'projectPurchase.alertMessage',
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
          clearOnChange: [
            'projectPurchase.contractor.name',
            'projectPurchase.contractor.nationalId',
          ],
        }),
        buildNationalIdWithNameField({
          id: 'projectPurchase.contractor',
          width: 'full',
          required: true,
          searchCompanies: true,
          searchPersons: true,
          condition: (answer: FormValue) =>
            getValueViaPath(answer, 'projectPurchase.radio') === YES,
        }),
      ],
    }),
  ],
})
