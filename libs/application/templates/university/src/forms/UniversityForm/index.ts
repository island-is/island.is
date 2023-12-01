import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { externalData } from '../../lib/messages'
import { PersonalSection } from './PersonalSection'
import { ProgramSection } from './ProgramSection'
// import { Logo } from '../../assets/Logo'

export const UniversityForm: Form = buildForm({
  id: 'UniversityFormDraft',
  title: '',
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
    PersonalSection,
    ProgramSection,
  ],
})
