import {
  CoOwnerAndOperator,
  ReviewCoOwnerAndOperatorField,
  ReviewSectionProps,
  UserInformation,
} from '../types'
import { Application } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'

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

  /* const buyerCoOwnerAndOperator = getValueViaPath(
    application.answers,
    'buyerCoOwnerAndOperator',
    [],
  ) as CoOwnerAndOperator[] */

  const buyerCoOwner = coOwnersAndOperators.filter(
    (reviewer) => reviewer.type === 'coOwner',
  )
  const buyerOperator = coOwnersAndOperators.filter(
    (reviewer) => reviewer.type === 'operator',
  )

  const sellerCoOwnerApproved = sellerCoOwner.find(
    (coOwner) => !coOwner.approved,
  )
  const buyerCoOwnerApproved = buyerCoOwner.find((coOwner) => !coOwner.approved)
  const buyerOperatorApproved = buyerOperator.find(
    (operator) => !operator.approved,
  )

  // TODO: Check if use plural wording
  // TODO: Add to messages

  const steps = [
    // Transfer of vehicle: Always approved
    {
      tagText: 'Móttekin',
      tagVariant: 'mint',
      title: `Skráning eigendaskipta á ökutæki ${vehiclePlate}`,
      description: 'Tilkynning um eigendaskiptu hefur borist til Samgöngustofu',
    },
    // Payment: Always approved
    {
      tagText: 'Móttekin',
      tagVariant: 'mint',
      title: 'Greiðsla móttekin',
      description: 'Greitt hefur verið fyrir eigendaskiptin af seljanda',
    },
    // Sellers coowner
    {
      tagText: sellerCoOwnerApproved ? 'Samþykki í bið' : 'Móttekin',
      tagVariant: sellerCoOwnerApproved ? 'purple' : 'mint',
      title: 'Samþykki meðeiganda seljanda',
      description:
        'Beðið er eftir að meðeigandi/ur seljanda staðfesti eigendaskiptin.',
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
      tagText: buyerApproved ? 'Móttekin' : 'Samþykki í bið',
      tagVariant: buyerApproved ? 'mint' : 'purple',
      title: 'Samþykki kaupanda',
      description: 'Beðið er eftir að nýr eigandi staðfesti eigendaskiptin.',
    },
    // Buyers coowner
    {
      tagText: buyerCoOwnerApproved ? 'Samþykki í bið' : 'Móttekin',
      tagVariant: buyerCoOwnerApproved ? 'purple' : 'mint',
      title: 'Samþykki meðeiganda kaupanda',
      description:
        'Beðið er eftir að meðeigandi/ur kaupanda staðfesti eigendaskiptin.',
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
      tagText: buyerOperatorApproved ? 'Samþykki í bið' : 'Móttekin',
      tagVariant: buyerOperatorApproved ? 'purple' : 'mint',
      title: 'Samþykki umráðarmanns kaupanda',
      description:
        'Beðið er eftir að umráðamaður/menn kaupanda staðfesti eigendaskiptin.',
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
