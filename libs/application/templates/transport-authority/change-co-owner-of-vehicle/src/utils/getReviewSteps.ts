import {
  ReviewSectionProps,
  UserInformation,
  OwnerCoOwnersInformation,
} from '../shared'
import { Application } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { review } from '../lib/messages'

export const getReviewSteps = (application: Application) => {
  const vehiclePlate = getValueViaPath(
    application.answers,
    'pickVehicle.plate',
    '',
  ) as string

  const ownerCoOwners = getValueViaPath(
    application.answers,
    'ownerCoOwners',
    [],
  ) as OwnerCoOwnersInformation[]

  const coOwners = getValueViaPath(
    application.answers,
    'coOwners',
    [],
  ) as UserInformation[]

  const ownerCoOwnerNotApproved = ownerCoOwners.find(
    (coOwner) => !coOwner.approved,
  )
  const coOwnerNotApproved = coOwners.find((operator) => !operator.approved)

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
    // Coowners
    {
      tagText:
        !ownerCoOwnerNotApproved && !coOwnerNotApproved
          ? review.step.tagText.received
          : review.step.tagText.pendingApproval,
      tagVariant:
        !ownerCoOwnerNotApproved && !coOwnerNotApproved ? 'mint' : 'purple',
      title: review.step.title.coOwner,
      description: review.step.description.coOwner,
      visible: ownerCoOwners.length > 0 || coOwners.length > 0,
      reviewer: [
        ...ownerCoOwners.map((reviewer) => {
          return {
            nationalId: reviewer.nationalId,
            name: reviewer.name,
            approved: reviewer.approved || false,
          }
        }),
        ...coOwners.map((reviewer) => {
          return {
            nationalId: reviewer.nationalId,
            name: reviewer.name,
            approved: reviewer.approved || false,
          }
        }),
      ],
    },
  ] as ReviewSectionProps[]

  return steps
}
