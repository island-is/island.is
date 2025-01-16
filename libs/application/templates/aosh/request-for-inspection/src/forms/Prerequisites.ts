import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { prerequisitesSection } from './RequestMachineForInspectionForm/prerequisitesSection'
import { Logo } from '../assets/Logo'
import { conclusion, information } from '../lib/messages'

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  logo: Logo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    prerequisitesSection,
    buildSection({
      id: 'informationSection',
      title: information.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'conclusion',
      title: conclusion.general.sectionTitle,
      children: [],
    }),
  ],
})
