import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../lib/messages'
import { childrenNGuardiansSection } from './childrenNGuardiansSection'
import { conclusionSection } from './conclusionSection'
import { differentNeedsSection } from './differentNeedsSection'
import { overviewSection } from './overviewSection'
import { primarySchoolSection } from './primarySchoolSection'

export const NewPrimarySchoolForm: Form = buildForm({
  id: 'newPrimarySchoolDraft',
  title: newPrimarySchoolMessages.shared.formTitle,
  mode: FormModes.DRAFT,
  children: [
    childrenNGuardiansSection,
    primarySchoolSection,
    differentNeedsSection,
    overviewSection,
    conclusionSection,
  ],
})
