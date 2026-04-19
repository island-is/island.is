import {
  Application,
  ApplicationRole,
  DefaultEvents,
  PendingAction,
} from '@island.is/application/types'
import { Roles } from './constants'
import { getApplicationCardRentalSummary } from './applicationCardSummary'
import { getAssigneeApproverDisplayName } from './assigneeUtils'
import { actionCardMessages as ac } from '../lib/messages/actionCardMessages'
import {
  coreHistoryMessages,
  getValueViaPath,
} from '@island.is/application/core'

const rentalMessageValues = (application: Application) => {
  const s = getApplicationCardRentalSummary(application)
  return {
    applicantName: s.applicantName || '—',
    rentalAddress: s.rentalAddress || '—',
  }
}

const draftCardDescription = (application: Application) => {
  const { applicantName, rentalAddress } =
    getApplicationCardRentalSummary(application)
  const address = rentalAddress.trim()
  const name = applicantName.trim()

  if (address && name) {
    return {
      ...ac.cardDescriptionDraftFull,
      values: { address, applicantName: name },
    }
  }
  if (!address && name) {
    return {
      ...ac.cardDescriptionDraftNameOnly,
      values: { applicantName: name },
    }
  }
  if (address && !name) {
    return {
      ...ac.cardDescriptionDraftAddressOnly,
      values: { address },
    }
  }

  return ''
}

export const housingBenefitsActionCards = {
  draft: {
    title: ac.applicationTitle,
    description: draftCardDescription,
    pendingAction: {
      displayStatus: 'info' as const,
      title: ac.pendingTitleDraft,
      content: ac.pendingContentDraft,
    },
    historyLogs: [
      {
        onEvent: DefaultEvents.SUBMIT,
        logMessage: (application: Application) => {
          const applicantName = getValueViaPath<string>(
            application.externalData,
            'nationalRegistry.data.fullName',
          )
          return {
            ...ac.historyDraftSubmitted,
            values: { applicantName },
          }
        },
      },
    ],
  },
  assigneeApproval: {
    title: ac.applicationTitle,
    description: draftCardDescription,
    pendingAction: (
      application: Application,
      role: ApplicationRole,
    ): PendingAction => {
      const values = rentalMessageValues(application)
      if (role === Roles.UNSIGNED_PREREQ_ASSIGNEE) {
        return {
          displayStatus: 'info',
          title: ac.pendingTitleAssigneePrereq,
          content: {
            ...ac.pendingContentAssigneePrereq,
            values,
          },
        }
      }
      if (role === Roles.UNSIGNED_DRAFT_ASSIGNEE) {
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
    historyLogs: [
      {
        onEvent: DefaultEvents.SUBMIT,
        logMessage: (application: Application, subjectNationalId?: string) => {
          const name = getAssigneeApproverDisplayName(
            application,
            subjectNationalId,
          )
          if (name) {
            return {
              ...ac.historyAssigneeApprovedWithName,
              values: { name },
            }
          }
          return ac.historyAssigneeApprovedGeneric
        },
      },
    ],
  },
  applicantSubmit: {
    title: ac.applicationTitle,
    description: ac.applicantSubmitDescription,
    pendingAction: (application: Application): PendingAction => ({
      displayStatus: 'info',
      title: ac.pendingTitleApplicantSubmit,
      content: {
        ...ac.pendingContentApplicantSubmit,
        values: rentalMessageValues(application),
      },
    }),
    historyLogs: [
      {
        onEvent: DefaultEvents.SUBMIT,
        logMessage: (application: Application) => {
          const applicantName = getValueViaPath<string>(
            application.externalData,
            'nationalRegistry.data.fullName',
          )
          return {
            ...ac.historyApplicantSubmitted,
            values: { applicantName: applicantName ?? '' },
          }
        },
      },
    ],
  },
  inReview: {
    title: ac.applicationTitle,
    description: ac.inReviewDescription,
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
    historyLogs: [
      {
        onEvent: DefaultEvents.APPROVE,
        logMessage: coreHistoryMessages.applicationApproved,
      },
      {
        onEvent: DefaultEvents.EDIT,
        logMessage: ac.historyInReviewRequestedExtraData,
      },
    ],
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
    historyLogs: [
      {
        onEvent: DefaultEvents.SUBMIT,
        logMessage: (application: Application) => {
          const applicantName = getValueViaPath<string>(
            application.externalData,
            'nationalRegistry.data.fullName',
          )
          return {
            ...ac.historyExtraDataSubmitted,
            values: { applicantName: applicantName ?? '' },
          }
        },
      },
    ],
  },
  approved: {
    title: ac.applicationTitle,
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
    title: ac.applicationTitle,
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
