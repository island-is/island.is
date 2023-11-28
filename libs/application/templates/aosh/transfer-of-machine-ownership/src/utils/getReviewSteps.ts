import { Operator, ReviewSectionProps, UserInformation } from '../shared'
import { Application } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { review } from '../lib/messages'
import { States } from '../lib/constants'

export const getReviewSteps = (
  application: Application,
  buyerOperators: Operator[],
) => {
  const vehiclePlate = getValueViaPath(
    application.answers,
    'pickVehicle.plate',
    '',
  ) as string

  const buyer = getValueViaPath(application.answers, 'buyer') as UserInformation

  const buyerApproved = getValueViaPath(
    application.answers,
    'buyer.approved',
    false,
  ) as boolean

  const buyerOperatorNotApproved = buyerOperators.find(
    (operator) => !operator.approved,
  )

  const isComplete = application.state === States.COMPLETED

  const steps = [
    // Transfer of vehicle: Always approved
    {
      tagText: review.step.tagText.received,
      tagVariant: 'mint',
      title: review.step.title.transferOfVehicle,
      description: review.step.description.transferOfVehicle,
      messageValue: vehiclePlate,
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
    // Buyers operators
    {
      tagText:
        !buyerOperatorNotApproved || isComplete
          ? review.step.tagText.received
          : review.step.tagText.pendingApproval,
      tagVariant: !buyerOperatorNotApproved || isComplete ? 'mint' : 'purple',
      title: review.step.title.buyerOperator,
      description: review.step.description.buyerOperator,
      visible: buyerOperators.length > 0,
      reviewer: buyerOperators.map((reviewer) => {
        return {
          nationalId: reviewer.nationalId,
          name: reviewer.name,
          approved: reviewer.approved || false,
        }
      }),
    },
  ] as ReviewSectionProps[]

  return steps
}
