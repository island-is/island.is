import { ApplicationStatus } from '@island.is/application/types'
import { coreMessages } from '@island.is/application/core'
import { DefaultCardData } from '../types'

export const defaultCardDataByStatus: Record<
  ApplicationStatus,
  DefaultCardData
> = {
  [ApplicationStatus.REJECTED]: {
    tag: {
      variant: 'red',
      label: coreMessages.tagsRejected,
    },
    progress: {
      variant: 'red',
    },
    cta: {
      label: coreMessages.cardButtonRejected,
    },
  },
  [ApplicationStatus.COMPLETED]: {
    tag: {
      variant: 'mint',
      label: coreMessages.tagsDone,
    },
    progress: {
      variant: 'mint',
    },
    cta: {
      label: coreMessages.cardButtonComplete,
    },
  },
  [ApplicationStatus.IN_PROGRESS]: {
    tag: {
      variant: 'blueberry',
      label: coreMessages.tagsInProgress,
    },
    progress: {
      variant: 'blue',
    },
    cta: {
      label: coreMessages.cardButtonInProgress,
    },
  },
  [ApplicationStatus.DRAFT]: {
    tag: {
      variant: 'blue',
      label: coreMessages.tagsDraft,
    },
    progress: {
      variant: 'blue',
    },
    cta: {
      label: coreMessages.cardButtonDraft,
    },
  },
  [ApplicationStatus.APPROVED]: {
    tag: {
      variant: 'mint',
      label: coreMessages.tagsApproved,
    },
    progress: {
      variant: 'mint',
    },
    cta: {
      label: coreMessages.cardButtonApproved,
    },
  },
  [ApplicationStatus.NOT_STARTED]: {
    tag: {
      variant: 'blueberry',
      label: coreMessages.newApplication,
    },
    progress: {
      variant: 'blue',
    },
    cta: {
      label: coreMessages.cardButtonNotStarted,
    },
  },
}
