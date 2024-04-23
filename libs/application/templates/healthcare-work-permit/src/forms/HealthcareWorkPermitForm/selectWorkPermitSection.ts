import {
  buildAlertMessageField,
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { information } from '../../lib/messages'

export const SelectWorkPermitSection = buildSection({
  id: 'selectWorkPermitSection',
  title: information.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'selectWorkPermit.multiField',
      title: information.labels.selectWorkPermit.pageTitle,
      description: information.labels.selectWorkPermit.description,
      children: [
        buildAlertMessageField({
          id: 'selectWorkPermit.infoMessage',
          title: '',
          message: information.labels.selectWorkPermit.infoMessage,
          alertType: 'info',
          doesNotRequireAnswer: true,
        }),
        buildCustomField({
          id: 'selectWorkPermit',
          component: 'SelectWorkPermitField',
          title: '',
        }),
      ],
    }),
  ],
})
