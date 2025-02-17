import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { externalData } from '../../lib/messages'
import { InformationSection } from './InformationSection'
import { FormerEducationSection } from './FormerEducation'
import { ReviewSection } from '../Review'
// import { Logo } from '../../assets/Logo'

export const UniversityForm: Form = buildForm({
  id: 'UniversityFormDraft',
  // logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    InformationSection,
    FormerEducationSection,
    ReviewSection,
  ],
})
