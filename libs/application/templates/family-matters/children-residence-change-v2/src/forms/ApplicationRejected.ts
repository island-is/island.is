import {
  buildForm,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'
import * as m from '../lib/messages'

export const ApplicationRejected: Form = buildForm({
  id: 'ApplicationRejected',
  title: m.application.name,
  logo: DistrictCommissionersLogo,
  children: [
    buildSection({
      id: 'rejected',
      title: m.section.rejected,
      children: [
        buildCustomField({
          id: 'ApplicationRejected',
          title: m.rejected.general.pageTitle,
          component: 'Rejected',
        }),
      ],
    }),
  ],
})
