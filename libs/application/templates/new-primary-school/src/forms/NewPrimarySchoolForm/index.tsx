import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../lib/messages'
import { childrenNGuardiansSection } from './childrenNGuardiansSection'
import { conclusionSection } from './conclusionSection'
import { differentNeedsSection } from './differentNeedsSection'
import { overviewSection } from './overviewSection'
import { primarySchoolSection } from './primarySchoolSection'
import { applicationTypeSection } from './applicationTypeSection'
import { ApplicationType } from '../..'

export const NewPrimarySchoolForm: Form = buildForm({
  id: 'newPrimarySchoolDraft',
  title: newPrimarySchoolMessages.shared.formTitle,
  mode: FormModes.DRAFT,
  children: [
    {
      ...applicationTypeSection,
      condition: (answers) => !answers.applicationType, // Only show if applicationType is not set
    },
    childrenNGuardiansSection,
    {
      ...primarySchoolSection,
      condition: (answers) => {
        // only show primary school section if applicationType is not CONTINUING_ENROLLMENT
        return answers.applicationType !== ApplicationType.CONTINUING_ENROLLMENT
      },
    },
    differentNeedsSection,
    overviewSection,
    conclusionSection,
  ],
})
