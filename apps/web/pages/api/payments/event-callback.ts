import type { NextApiRequest, NextApiResponse } from 'next'

import type {
  DirectGrantCallbackMetadata,
  MemorialCardCallbackMetadata,
} from '@island.is/api/domains/landspitali'
import type { ApiClientCallback } from '@island.is/api/domains/payment'
import initApollo from '@island.is/web/graphql/client'
import type { ContactUsZendeskTicketMutation } from '@island.is/web/graphql/schema'
import { CONTACT_US_ZENDESK_TICKET_MUTATION } from '@island.is/web/screens/queries'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // TODO: Perhaps validate the body
  const payment = req.body as ApiClientCallback

  // TODO: Validate the callback and make sure it is actually coming from trusted source

  if (payment.type !== 'success') {
    // TODO: What should I do here?
    // Look into libs/application/api/payment/src/lib/payment-callback.controller.ts
    return res.status(200).send('')
  }

  const apolloClient = initApollo({})

  const metadata = payment.paymentFlowMetadata as unknown as
    | DirectGrantCallbackMetadata
    | MemorialCardCallbackMetadata

  const response = await apolloClient.mutate<ContactUsZendeskTicketMutation>({
    mutation: CONTACT_US_ZENDESK_TICKET_MUTATION,
    variables: {
      input: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        subject: 'Payment failed',
        message: 'Payment failed',
      },
    },
  })

  if (response.data?.contactUsZendeskTicket?.sent) {
    res.status(200).json({ message: 'Zendesk ticket submitted' })
  } else {
    res.status(500).json({ message: 'Failed to submit zendesk ticket' })
  }
}
