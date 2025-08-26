import { ReviewSectionProps, UserInformation } from '../shared'
import { Application } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { review } from '../lib/messages'
import { States } from '../lib/constants'

export const getReviewSteps = (application: Application) => {
  const regNumber = getValueViaPath(
    application.answers,
    'machine.regNumber',
    '',
  ) as string

  const buyer = getValueViaPath(application.answers, 'buyer') as UserInformation

  const buyerApproved = getValueViaPath(
    application.answers,
    'buyer.approved',
    false,
  ) as boolean

  const isComplete = application.state === States.COMPLETED

  const steps = [
    // Transfer of machine: Always approved
    {
      tagText: review.step.tagText.received,
      tagVariant: 'mint',
      title: review.step.title.transferOfMachine,
      description: review.step.description.transferOfMachine,
      messageValue: regNumber,
    },
    // Payment: Always approved
    {
      tagText: review.step.tagText.received,
      tagVariant: 'mint',
      title: review.step.title.payment,
      description: review.step.description.payment,
    },
    // Buyer
    {
      tagText:
        buyerApproved || isComplete
          ? review.step.tagText.received
          : review.step.tagText.pendingApproval,
      tagVariant: buyerApproved || isComplete ? 'mint' : 'purple',
      title: review.step.title.buyer,
      description: review.step.description.buyer,
      reviewer: [
        {
          nationalId: buyer.nationalId || '',
          name: buyer.name || '',
          approved: buyerApproved || isComplete,
        },
      ],
    },
  ] as ReviewSectionProps[]

  return steps
}
