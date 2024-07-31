import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '@island.is/application/templates/family-matters-core/assets/Logo'
import * as m from '../../lib/messages'
import { backgroundInformationSection } from './BackgroundInformationSection'
import { arrangementSection } from './ArrangementSection'
import { approveTermsSection } from './ApproveTermsSection'
import { overviewSection } from './OverviewSection'
import { submittedSection } from './SubmittedSection'

export const ChildrenResidenceChangeForm: Form = buildForm({
  id: 'ChildrenResidenceChangeFormDraft',
  title: m.application.name,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    backgroundInformationSection,
    arrangementSection,
    approveTermsSection,
    overviewSection,
    submittedSection,
  ],
})
