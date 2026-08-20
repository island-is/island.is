import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { DirectorateOfEqualityLogo } from '@island.is/application/assets/institution-logos'
import { buildCommentThreadSection } from '../commentThreadSection'
import { buildDebugEventsSection } from '../debugEventsSection'
import { draftRetryGoalsAndActionsSection } from './goalsAndActionsSection'

export const draftRetryForm = buildForm({
  id: 'draftRetryForm',
  logo: DirectorateOfEqualityLogo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    // Standalone screen, landing first — separate from the editable content
    // below rather than embedded inline in it.
    buildCommentThreadSection({ alwaysVisible: true }),
    draftRetryGoalsAndActionsSection,
    buildDebugEventsSection(),
  ],
})
