import {
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const workhealthSection = buildSubSection({
  id: 'workhealthSection',
  title: information.labels.workhealth.sectionTitle,
  children: [
    buildMultiField({
      id: 'workhealth',
      title: information.labels.workhealth.pageTitle,
      description: information.labels.workhealth.pageDescription,
      children: [
        buildDescriptionField({
          id: 'companyInformation.description',
          title: information.labels.workhealth.descriptionField,
          titleVariant: 'h5',
        }),
        buildAlertMessageField({
          id: 'companyLaborProtection.alertField',
          alertType: 'info',
          message: information.labels.laborProtection.alertMessageText,
          doesNotRequireAnswer: true,
        }),
        buildCustomField({
          id: 'companyLaborProtection.workhealthAndSafetyOccupation',
          component: 'CheckboxFieldCustom',
        }),
      ],
    }),
  ],
})
