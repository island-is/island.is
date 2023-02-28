import { ActionCardTag, ApplicationStatus } from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'
import { m } from '../lib/messages'

interface Tag {
  variant: ActionCardTag
  label: MessageDescriptor
}

export const statusMapper: Record<ApplicationStatus, Tag> = {
  [ApplicationStatus.REJECTED]: {
    variant: 'red',
    label: m.tagsRejected,
  },
  [ApplicationStatus.COMPLETED]: {
    variant: 'mint',
    label: m.tagsDone,
  },
  [ApplicationStatus.IN_PROGRESS]: {
    variant: 'blueberry',
    label: m.tagsInProgress,
  },
  [ApplicationStatus.DRAFT]: {
    variant: 'blue',
    label: m.tagsDraft,
  },
  [ApplicationStatus.APPROVED]: {
    variant: 'mint',
    label: m.tagsApproved,
  },
  [ApplicationStatus.NOT_STARTED]: {
    variant: 'blueberry',
    label: m.newApplication,
  },
}
