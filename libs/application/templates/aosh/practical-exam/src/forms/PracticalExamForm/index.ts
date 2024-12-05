import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Logo } from '../../assets/Logo'
import { informationSection } from './InformationSection'
import { examineeSection } from './ExamineeSection'

export const PracticalExamForm: Form = buildForm({
  id: 'PracticalExamFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [examineeSection, informationSection],
})
