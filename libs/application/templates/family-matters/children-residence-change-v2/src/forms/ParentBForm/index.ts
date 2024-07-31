import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '@island.is/application/templates/family-matters-core/assets/Logo'
import * as m from '../../lib/messages'
import { parentBIntroSection } from './parentBIntroSection'
import { termsParentBSection } from './termsParentBSection'
import { contactSection } from './contactSection'
import { residenceChangeOverviewSection } from './residenceChangeOverviewSection'
import { submittedSection } from './submittedSection'
import { rejectContractSection } from './rejectContractSection'
import { contractRejectedSection } from './contractRejectedSection'

export const ParentBForm: Form = buildForm({
  id: 'ParentBForm',
  title: m.application.name,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  children: [
    parentBIntroSection,
    termsParentBSection,
    contactSection,
    residenceChangeOverviewSection,
    submittedSection,
    rejectContractSection,
    contractRejectedSection,
  ],
})
