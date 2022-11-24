import {
  ReviewCoOwnerAndOperatorField,
  ReviewSectionProps,
  UserInformation,
} from '../types'
import { Application } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { review } from '../lib/messages'

export const getReviewSteps = (
  application: Application,
  coOwnersAndOperators: ReviewCoOwnerAndOperatorField[],
) => {
  const vehiclePlate = getValueViaPath(
    application.answers,
    'vehicle.plate',
    '',
  ) as string

  const sellerCoOwner = getValueViaPath(
    application.answers,
    'sellerCoOwner',
    [],
  ) as UserInformation[]

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

  const sellerCoOwnerApproved = sellerCoOwner.find(
    (coOwner) => coOwner.approved,
  )
  const buyerCoOwnerApproved = buyerCoOwner.find((coOwner) => coOwner.approved)
  const buyerOperatorApproved = buyerOperator.find(
    (operator) => operator.approved,
  )

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
      tagText: sellerCoOwnerApproved
        ? review.step.tagText.received
        : review.step.tagText.pendingApproval,
      tagVariant: sellerCoOwnerApproved ? 'mint' : 'purple',
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
      tagText: buyerApproved
        ? review.step.tagText.received
        : review.step.tagText.pendingApproval,
      tagVariant: buyerApproved ? 'mint' : 'purple',
      title: review.step.title.buyer,
      description: review.step.description.buyer,
    },
    // Buyers coowner
    {
      tagText: buyerCoOwnerApproved
        ? review.step.tagText.received
        : review.step.tagText.pendingApproval,
      tagVariant: buyerCoOwnerApproved ? 'mint' : 'purple',
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
      tagText: buyerOperatorApproved
        ? review.step.tagText.received
        : review.step.tagText.pendingApproval,
      tagVariant: buyerOperatorApproved ? 'mint' : 'purple',
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
