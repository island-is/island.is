import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
} from '@island.is/application/core'
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
