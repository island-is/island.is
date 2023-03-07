import {
  CoOwnerAndOperator,
  ReviewSectionProps,
  UserInformation,
} from '../shared'
import { Application } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { review } from '../lib/messages'
import { States } from '../lib/constants'

export const getReviewSteps = (
  application: Application,
  coOwnersAndOperators: CoOwnerAndOperator[],
) => {
  const vehiclePlate = getValueViaPath(
    application.answers,
    'pickVehicle.plate',
    '',
  ) as string

  const sellerCoOwner = getValueViaPath(
    application.answers,
    'sellerCoOwner',
    [],
  ) as UserInformation[]

  const buyer = getValueViaPath(application.answers, 'buyer') as UserInformation

  const buyerApproved = getValueViaPath(
    application.answers,
    'buyer.approved',
    false,
  ) as boolean

  const buyerCoOwner = coOwnersAndOperators.filter(
    (reviewer) => reviewer.type === 'coOwner',
  )
  const buyerOperator = coOwnersAndOperators.filter(
    (reviewer) => reviewer.type === 'operator',
  )

  const sellerCoOwnerNotApproved = sellerCoOwner.find(
    (coOwner) => !coOwner.approved,
  )
  const buyerCoOwnerNotApproved = buyerCoOwner.find(
    (coOwner) => !coOwner.approved,
  )
  const buyerOperatorNotApproved = buyerOperator.find(
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
    // Sellers coowner
    {
      tagText:
        !sellerCoOwnerNotApproved || isComplete
          ? review.step.tagText.received
          : review.step.tagText.pendingApproval,
      tagVariant: !sellerCoOwnerNotApproved || isComplete ? 'mint' : 'purple',
      title: review.step.title.sellerCoOwner,
      description: review.step.description.sellerCoOwner,
      visible: sellerCoOwner.length > 0,
      reviewer: sellerCoOwner.map((reviewer) => {
        return {
          nationalId: reviewer.nationalId,
          name: reviewer.name,
          approved: reviewer.approved || false,
        }
      }),
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
    // Buyers coowner
    {
      tagText:
        !buyerCoOwnerNotApproved || isComplete
          ? review.step.tagText.received
          : review.step.tagText.pendingApproval,
      tagVariant: !buyerCoOwnerNotApproved || isComplete ? 'mint' : 'purple',
      title: review.step.title.buyerCoOwner,
      description: review.step.description.buyerCoOwner,
      visible: buyerCoOwner.length > 0,
      reviewer: buyerCoOwner.map((reviewer) => {
        return {
          nationalId: reviewer.nationalId,
          name: reviewer.name,
          approved: reviewer.approved || false,
        }
      }),
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
      visible: buyerOperator.length > 0,
      reviewer: buyerOperator.map((reviewer) => {
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
