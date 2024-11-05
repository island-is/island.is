import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import {
  information,
  externalData,
  sections,
  overview,
  employee,
} from '../lib/messages'
import { Logo } from '../assets/Logo'
import { conclusionSection } from './WorkAccidentNotificationForm/ConclusionSection'

export const Conclusion: Form = buildForm({
  id: 'ConclusionApplicationForm',
  title: '',
  logo: Logo,
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'announcement',
      title: externalData.dataProvider.announcement,
      children: [],
    }),
    buildSection({
      id: 'informationSection',
      title: information.general.pageTitle,
      children: [],
    }),
    buildSection({
      id: 'accidentSection',
      title: sections.draft.accident,
      children: [],
    }),
    buildSection({
      id: `employeeSection`,
      title: employee.employee.pageTitle,
      children: [],
    }),
    buildSection({
      id: `causeAndConsequencesSection`,
      title: sections.draft.causes,
      children: [],
    }),
    buildSection({
      id: `overviewSection`,
      title: overview.general.sectionTitle,
      children: [],
    }),
    conclusionSection,
  ],
})
