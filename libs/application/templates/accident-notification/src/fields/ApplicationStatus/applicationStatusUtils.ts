import {
  FormatMessage,
  FormValue,
  TagVariant,
} from '@island.is/application/types'
import { inReview } from '../../lib/messages'
import { AccidentNotificationStatusEnum } from './StatusStep/types'
import { getValueViaPath } from '@island.is/application/core'
import { ReviewApprovalEnum } from '../../utils/enums'
import { AccidentNotificationStatus } from '@island.is/api/schema'
import {
  hasReceivedConfirmation,
  isInjuredAndRepresentativeOfCompanyOrInstitute,
  shouldRequestReview,
} from '../../utils/miscUtils'

import { AccidentNotificationAnswers } from '../..'
import { MessageDescriptor } from 'react-intl'
import { ActionProps } from './StatusStep'
import { hasReceivedAllDocuments } from '../../utils/documentUtils'

type Steps = {
  title: string
  description: string
  hasActionMessage: boolean
  action?: ActionProps
  visible?: boolean
  tagText: MessageDescriptor | string
  tagVariant: TagVariant
}

export const tagMapperApplicationStatus = {
  [AccidentNotificationStatusEnum.ACCEPTED]: {
    variant: 'blue',
    text: inReview.tags.received,
  },
  [AccidentNotificationStatusEnum.REFUSED]: {
    variant: 'blue',
    text: inReview.tags.received,
  },
  [AccidentNotificationStatusEnum.INPROGRESS]: {
    variant: 'purple',
    text: inReview.tags.pending,
  },
  [AccidentNotificationStatusEnum.INPROGRESSWAITINGFORDOCUMENT]: {
    variant: 'purple',
    text: inReview.tags.pending,
  },
}

export const getStatusAndApproval = (answers: FormValue) => {
  const currentAccidentStatus = getValueViaPath(
    answers,
    'accidentStatus',
  ) as AccidentNotificationStatus

  const reviewApproval = getValueViaPath(
    answers,
    'reviewApproval',
    ReviewApprovalEnum.NOTREVIEWED,
  ) as ReviewApprovalEnum

  return { currentAccidentStatus, reviewApproval }
}

export const firstStep = (formatMessage: FormatMessage) => {
  return {
    tagText: formatMessage(inReview.tags.received),
    tagVariant: 'blue',
    title: formatMessage(inReview.application.title),
    description: formatMessage(inReview.application.summary),
    hasActionMessage: false,
  }
}

export const secondStep = (
  formatMessage: FormatMessage,
  answers: FormValue,
  errorMessage: string,
  changeScreens: (screen: string) => void,
) => {
  return {
    tagText: hasReceivedAllDocuments(answers)
      ? formatMessage(inReview.tags.received)
      : formatMessage(inReview.tags.missing),
    tagVariant: hasReceivedAllDocuments(answers) ? 'blue' : 'rose',
    title: formatMessage(inReview.documents.title),
    description: formatMessage(inReview.documents.summary),
    hasActionMessage: errorMessage.length > 0,
    action: {
      cta: () => {
        changeScreens('addAttachmentScreen')
      },
      title: formatMessage(inReview.action.documents.title),
      description: formatMessage(inReview.action.documents.description),
      fileNames: errorMessage, // We need to get this from first form
      actionButtonTitle: formatMessage(
        inReview.action.documents.actionButtonTitle,
      ),
      hasActionButtonIcon: true,
      showAlways: true,
    },
  }
}

export const thirdStep = (
  formatMessage: FormatMessage,
  answers: FormValue,
  isAssignee: boolean,
  changeScreens: (screen: string) => void,
) => {
  const hasReviewerSubmitted = hasReceivedConfirmation(answers)

  return {
    tagText: hasReviewerSubmitted
      ? formatMessage(inReview.tags.received)
      : formatMessage(inReview.tags.missing),
    tagVariant: hasReviewerSubmitted ? 'blue' : 'rose',
    title: formatMessage(
      hasReviewerSubmitted
        ? inReview.representative.titleDone
        : inReview.representative.title,
    ),
    description: formatMessage(
      hasReviewerSubmitted
        ? inReview.representative.summaryDone
        : inReview.representative.summary,
    ),
    hasActionMessage: isAssignee && !hasReviewerSubmitted,
    action:
      isAssignee && !hasReviewerSubmitted
        ? {
            cta: () => changeScreens('inReviewOverviewScreen'),
            title: formatMessage(inReview.action.representative.title),
            description: formatMessage(
              inReview.action.representative.description,
            ),
            actionButtonTitle: formatMessage(
              inReview.action.representative.actionButtonTitle,
            ),
          }
        : undefined,
    visible: !(
      !shouldRequestReview(answers as AccidentNotificationAnswers) ||
      isInjuredAndRepresentativeOfCompanyOrInstitute(answers)
    ),
  }
}

export const fourthStep = (
  formatMessage: FormatMessage,
  answers: FormValue,
  currentAccidentStatus: AccidentNotificationStatus,
) => {
  const hasReviewerSubmitted = hasReceivedConfirmation(answers)

  return {
    tagText: formatMessage(
      tagMapperApplicationStatus[currentAccidentStatus.status].text,
    ),
    tagVariant:
      tagMapperApplicationStatus[currentAccidentStatus.status].variant,
    title: formatMessage(inReview.sjukratrygging.title),
    description:
      hasReviewerSubmitted && hasReceivedAllDocuments(answers)
        ? formatMessage(inReview.sjukratrygging.summaryDone)
        : formatMessage(inReview.sjukratrygging.summary),
    hasActionMessage: false,
  }
}

export const getSteps = (
  formatMessage: FormatMessage,
  answers: FormValue,
  changeScreens: (screen: string) => void,
  errorMessage: string,
  isAssignee: boolean,
  currentAccidentStatus: AccidentNotificationStatus,
) => {
  return [
    firstStep(formatMessage),
    secondStep(formatMessage, answers, errorMessage, changeScreens),
    thirdStep(formatMessage, answers, isAssignee, changeScreens),
    fourthStep(formatMessage, answers, currentAccidentStatus),
  ] as Steps[]
}
