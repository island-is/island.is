import { buildForm, buildCustomField } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { declined } from '../lib/messages'

export const GeneralFishingLicenseDeclinedForm: Form = buildForm({
  id: 'GeneralFishingLicenseDeclinedForm',
  title: declined.general.sectionTitle,
  mode: FormModes.REJECTED,
  children: [
    buildCustomField({
      id: 'rejected',
      component: 'Declined',
      title: declined.general.sectionTitle,
    }),
  ],
})
