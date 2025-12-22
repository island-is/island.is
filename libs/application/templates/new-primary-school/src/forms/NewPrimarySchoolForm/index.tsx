import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { sharedMessages } from '../../lib/messages'
import { childrenNGuardiansSection } from './childrenNGuardiansSection'
import { conclusionSection } from './conclusionSection'
import { differentNeedsSection } from './differentNeedsSection'
import { overviewSection } from './overviewSection'
import { primarySchoolSection } from './primarySchoolSection'
import { applicationTypeSection } from './applicationTypeSection'

export const NewPrimarySchoolForm: Form = buildForm({
  id: 'newPrimarySchoolDraft',
  title: sharedMessages.formTitle,
  mode: FormModes.DRAFT,
  children: [
    applicationTypeSection,
    childrenNGuardiansSection,
    primarySchoolSection,
    differentNeedsSection,
    overviewSection,
    conclusionSection,
  ],
})
