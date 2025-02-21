import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { primarySchoolMessages } from '../../lib/messages'
import { childrenNGuardiansSection } from './childrenNGuardiansSection'
import { conclusionSection } from './conclusionSection'
import { differentNeedsSection } from './differentNeedsSection'
import { overviewSection } from './overviewSection'
import { primarySchoolSection } from './primarySchoolSection'

export const PrimarySchoolForm: Form = buildForm({
  id: 'primarySchoolDraft',
  title: primarySchoolMessages.shared.formTitle,
  mode: FormModes.DRAFT,
  children: [
    childrenNGuardiansSection,
    primarySchoolSection,
    differentNeedsSection,
    overviewSection,
    conclusionSection,
  ],
})
