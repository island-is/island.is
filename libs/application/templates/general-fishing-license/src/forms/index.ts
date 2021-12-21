import {
  buildForm,
  buildSection,
  buildTextField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { application } from '../lib/messages'
import { externalDataSection } from './externalDataSection'

export const GeneralFishingLicenseForm: Form = buildForm({
  id: 'GeneralFishingLicenseForm',
  title: application.general.name,
  mode: FormModes.APPLYING,
  children: [
    externalDataSection,
    buildSection({
      id: 'application',
      title: 'hello',
      children: [
        buildTextField({
          id: 'applicant.name',
          title: 'title',
        }),
      ],
    }),
  ],
})
