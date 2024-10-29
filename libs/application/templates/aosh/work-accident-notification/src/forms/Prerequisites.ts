import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { prerequisitesSection } from './WorkAccidentNotificationForm/prerequisitesSection'
import { Logo } from '../assets/Logo'
import { sections } from '../lib/messages'

export const Prerequisites: Form = buildForm({
  id: 'PrerequisitesForm',
  title: '',
  logo: Logo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    prerequisitesSection,
    buildSection({
      id: 'information',
      title: sections.prerequisites.information,
      children: [],
    }),
    buildSection({
      id: 'accident',
      title: sections.prerequisites.accident,
      children: [],
    }),
    buildSection({
      id: 'employee',
      title: sections.prerequisites.employee,
      children: [],
    }),
    buildSection({
      id: 'overview',
      title: sections.prerequisites.overview,
      children: [],
    }),
    buildSection({
      id: 'conclusion',
      title: sections.prerequisites.conclusion,
      children: [],
    }),
  ],
})
