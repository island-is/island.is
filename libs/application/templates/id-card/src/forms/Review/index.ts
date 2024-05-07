import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
// import { Logo } from '../../assets/Logo'
import { StateSection } from './State'
import { OverviewSection } from './Overview'
import { ConclusionSection } from './Conclusion'

export const Review: Form = buildForm({
  id: 'Review',
  title: '',
  // logo: Logo,
  mode: FormModes.DRAFT,
  children: [StateSection, OverviewSection, ConclusionSection],
})
