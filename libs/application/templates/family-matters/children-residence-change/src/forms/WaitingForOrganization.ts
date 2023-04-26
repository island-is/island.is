import {
  buildForm,
  buildSection,
  buildAlertMessageField,
  buildMultiField,
  buildDescriptionField,
} from '@island.is/application/core'
import Logo from '@island.is/application/templates/family-matters-core/assets/Logo'
import * as m from '../lib/messages'

export const WaitingForOrganization = buildForm({
  id: 'WaitingForOrganization',
  title: m.application.name,
  logo: Logo,
  children: [
    buildSection({
      id: 'waiting',
      title: m.section.waiting,
      children: [
        buildMultiField({
          id: 'waitingForOrganizationMultifield',
          title: m.section.waiting,
          children: [
            buildDescriptionField({
              id: 'waitingForOrganizationDescription',
              title: '',
              description: m.stateDescriptions.waiting,
            }),
          ],
        }),
      ],
    }),
  ],
})
