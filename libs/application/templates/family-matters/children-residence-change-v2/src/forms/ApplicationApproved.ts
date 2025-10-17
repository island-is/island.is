import {
  buildForm,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'
import * as m from '../lib/messages'

export const ApplicationApproved: Form = buildForm({
  id: 'ApplicationApproved',
  title: m.application.name,
  logo: DistrictCommissionersLogo,
  children: [
    buildSection({
      id: 'approved',
      title: m.section.received,
      children: [
        buildCustomField({
          id: 'applicationApproved',
          title: m.approved.general.pageTitle,
          component: 'Approved',
        }),
      ],
    }),
  ],
})
