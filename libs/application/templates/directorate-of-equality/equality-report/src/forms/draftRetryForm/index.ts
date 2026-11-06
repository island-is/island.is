import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { DirectorateOfEqualityLogo } from '@island.is/application/assets/institution-logos'
import { draftRetryGoalsAndActionsSection } from './goalsAndActionsSection'

export const draftRetryForm = buildForm({
  id: 'draftRetryForm',
  logo: DirectorateOfEqualityLogo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    // The comment thread lives inline on the editable screen below rather than
    // on a standalone screen of its own — user testing showed applicants read
    // the comments and the edit form as one task.
    draftRetryGoalsAndActionsSection,
  ],
})
