import { MessageDescriptor } from '@formatjs/intl'

// Pure, React-free types for the eligibility review steps. Kept separate from
// the ReviewSection component so the step-mapping logic (extractReasons) can be
// imported and unit-tested without pulling in island-ui / vanilla-extract.
export enum ReviewSectionState {
  inProgress = 'In progress',
  requiresAction = 'Requires action',
  complete = 'Complete',
}

export interface Step {
  title: MessageDescriptor
  // string = RLS's own already-translated description (bypasses react-intl);
  // MessageDescriptor = our curated/Contentful copy.
  description: MessageDescriptor | string
  residenceRequirement?: MessageDescriptor
  state: ReviewSectionState
  daysOfResidency?: number
}
