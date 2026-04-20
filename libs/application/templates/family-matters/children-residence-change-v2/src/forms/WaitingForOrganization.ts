import {
  buildForm,
  buildSection,
  buildMultiField,
  buildDescriptionField,
} from '@island.is/application/core'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'
import * as m from '../lib/messages'

export const WaitingForOrganization = buildForm({
  id: 'WaitingForOrganization',
  title: m.application.name,
  logo: DistrictCommissionersLogo,
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
              description: m.stateDescriptions.waiting,
            }),
          ],
        }),
      ],
    }),
  ],
})
