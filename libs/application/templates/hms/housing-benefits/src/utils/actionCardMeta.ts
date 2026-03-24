import {
  Application,
  ApplicationRole,
  PendingAction,
} from '@island.is/application/types'
import { Roles } from './constants'
import { getApplicationCardRentalSummary } from './applicationCardSummary'
import { actionCardMessages as ac } from '../lib/messages/actionCardMessages'

const rentalMessageValues = (application: Application) => {
  const s = getApplicationCardRentalSummary(application)
  return {
    applicantName: s.applicantName || '—',
    rentalAddress: s.rentalAddress || '—',
  }
}

const draftCardTitle = (application: Application) => {
  const { applicantName, rentalAddress } =
    getApplicationCardRentalSummary(application)
  const address = rentalAddress.trim()
  const name = applicantName.trim()

  if (address && name) {
    return {
      ...ac.cardTitleDraftWithAddressAndApplicant,
      values: { address, applicantName: name },
    }
  }
  if (!address && name) {
    return {
      ...ac.cardTitleDraftWithApplicantOnly,
      values: { applicantName: name },
    }
  }
  if (address && !name) {
    return {
      ...ac.cardTitleDraftWithAddressOnly,
      values: { address },
    }
  }

  return ac.cardTitleDraft
}

export const housingBenefitsActionCards = {
  noRentalAgreement: {
    title: ac.cardTitleNoRental,
    pendingAction: {
      displayStatus: 'warning' as const,
      title: ac.pendingTitleNoRental,
      content: ac.pendingContentNoRental,
    },
  },
  draft: {
    title: draftCardTitle,
    pendingAction: (application: Application): PendingAction => ({
      displayStatus: 'info',
      title: ac.pendingTitleDraft,
      content: {
        ...ac.pendingContentDraft,
        values: rentalMessageValues(application),
      },
    }),
  },
  assigneeApproval: {
    title: ac.cardTitleAssignee,
    pendingAction: (
      application: Application,
      role: ApplicationRole,
    ): PendingAction => {
      const values = rentalMessageValues(application)
      if (role === Roles.UNSIGNED_ASSIGNEE) {
        return {
          displayStatus: 'warning',
          title: ac.pendingTitleAssigneeUnsigned,
          content: {
            ...ac.pendingContentAssigneeUnsigned,
            values,
          },
        }
      }
      if (role === Roles.APPLICANT) {
        return {
          displayStatus: 'info',
          title: ac.pendingTitleAssigneeApplicant,
          content: {
            ...ac.pendingContentAssigneeApplicant,
            values,
          },
        }
      }
      return {
        displayStatus: 'info',
        title: ac.pendingTitleAssigneeSigned,
        content: {
          ...ac.pendingContentAssigneeSigned,
          values,
        },
      }
    },
  },
  inReview: {
    title: ac.cardTitleInReview,
    pendingAction: (
      application: Application,
      role: ApplicationRole,
    ): PendingAction => {
      const values = rentalMessageValues(application)
      if (role === Roles.INSTITUTION) {
        return {
          displayStatus: 'warning',
          title: ac.pendingTitleInReviewInstitution,
          content: {
            ...ac.pendingContentInReviewInstitution,
            values,
          },
        }
      }
      return {
        displayStatus: 'info',
        title: ac.pendingTitleInReviewApplicant,
        content: {
          ...ac.pendingContentInReviewApplicant,
          values,
        },
      }
    },
  },
  extraData: {
    title: ac.cardTitleExtraData,
    pendingAction: (application: Application): PendingAction => ({
      displayStatus: 'warning',
      title: ac.pendingTitleExtraData,
      content: {
        ...ac.pendingContentExtraData,
        values: rentalMessageValues(application),
      },
    }),
  },
  approved: {
    title: ac.cardTitleApproved,
    pendingAction: (application: Application): PendingAction => ({
      displayStatus: 'success',
      title: ac.pendingTitleApproved,
      content: {
        ...ac.pendingContentApproved,
        values: rentalMessageValues(application),
      },
    }),
  },
  rejected: {
    title: ac.cardTitleRejected,
    pendingAction: (application: Application): PendingAction => ({
      displayStatus: 'error',
      title: ac.pendingTitleRejected,
      content: {
        ...ac.pendingContentRejected,
        values: rentalMessageValues(application),
      },
    }),
  },
}
