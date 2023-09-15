import { ReviewSectionProps, UserInformation } from '../shared'
import { Application } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { review } from '../lib/messages'
import { OperatorInformation } from '../shared'

export const getReviewSteps = (application: Application) => {
  const vehiclePlate = getValueViaPath(
    application.answers,
    'pickVehicle.plate',
    '',
  ) as string

  const ownerCoOwner = getValueViaPath(
    application.answers,
    'ownerCoOwner',
    [],
  ) as UserInformation[]

  const operators = getValueViaPath(
    application.answers,
    'operators',
    [],
  ) as OperatorInformation[]

  const filteredOperators = operators.filter(
    ({ wasRemoved }) => wasRemoved !== 'true',
  )

  const ownerCoOwnerNotApproved = ownerCoOwner.find(
    (coOwner) => !coOwner.approved,
  )
  const operatorNotApproved = filteredOperators.find(
    (operator) => !operator.approved,
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
      tagText: !ownerCoOwnerNotApproved
        ? review.step.tagText.received
        : review.step.tagText.pendingApproval,
      tagVariant: !ownerCoOwnerNotApproved ? 'mint' : 'purple',
      title: review.step.title.coOwner,
      description: review.step.description.coOwner,
      visible: ownerCoOwner.length > 0,
      reviewer: ownerCoOwner.map((reviewer) => {
        return {
          nationalId: reviewer.nationalId,
          name: reviewer.name,
          approved: reviewer.approved || false,
        }
      }),
    },
    // Buyers operators
    {
      tagText: !operatorNotApproved
        ? review.step.tagText.received
        : review.step.tagText.pendingApproval,
      tagVariant: !operatorNotApproved ? 'mint' : 'purple',
      title: review.step.title.operator,
      description: review.step.description.operator,
      visible: filteredOperators.length > 0,
      reviewer: filteredOperators.map((reviewer) => {
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
