import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Application } from '@island.is/api/schema'

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
        }),
        buildTextField({
          id: 'projectPurchase.nationalId',
          title: information.labels.company.nationalId,
          backgroundColor: 'white',
          width: 'half',
          format: '######-####',
        }),
        buildTextField({
          id: 'projectPurchase.name',
          title: information.labels.projectPurchase.name,
          backgroundColor: 'white',
          width: 'half',
        }),
      ],
    }),
  ],
})
