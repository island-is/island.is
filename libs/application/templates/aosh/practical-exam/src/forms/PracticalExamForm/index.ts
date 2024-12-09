import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Logo } from '../../assets/Logo'
import { informationSection } from './InformationSection'
import { examineeSection } from './ExamineeSection'
import { instructorSection } from './InstructorSection'
import { paymentArrangementSection } from './PaymentArrangement'
import { overviewSection } from './Overview'

export const PracticalExamForm: Form = buildForm({
  id: 'PracticalExamFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    informationSection,
    examineeSection,
    instructorSection,
    paymentArrangementSection,
    overviewSection,
  ],
})
