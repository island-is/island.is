import type { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'

import type { PaymentCallbackPayload } from '@island.is/api/domains/landspitali'
import environment from '@island.is/web/environments/environment'
import initApollo from '@island.is/web/graphql/client'
import type {
  ContactUsZendeskTicketMutation,
  ContactUsZendeskTicketMutationVariables,
} from '@island.is/web/graphql/schema'
import { CONTACT_US_ZENDESK_TICKET_MUTATION } from '@island.is/web/screens/queries'

const { serverRuntimeConfig = {} } = getConfig() ?? {}

const ZENDESK_EMAIL = serverRuntimeConfig.landspitaliZendeskEmail as string

const generateMessage = (payment: PaymentCallbackPayload) => {
  const lines = []

  if (payment.paymentFlowMetadata.landspitaliType === 'memorialCard') {
    const metadata = payment.paymentFlowMetadata
    lines.push(`Minningarsjóður: ${metadata.fundChargeItemCode}`) // TODO: Perhaps send the name of the fund and not the "id"?
    lines.push(`Til minningar um: ${metadata.inMemoryOf}`)
    lines.push(`Fjárhæð: ${metadata.amountISK} krónur`)
    lines.push(`Undirskrift sendanda: ${metadata.senderSignature}`)

    lines.push(`Nafn viðtakanda korts: ${metadata.recipientName}`)
    lines.push(`Heimilisfang viðtakanda korts: ${metadata.recipientAddress}`)
    lines.push(`Póstnúmer viðtakanda korts: ${metadata.recipientPostalCode}`)
    lines.push(`Staður viðtakanda korts: ${metadata.recipientPlace}`)

    lines.push(`Nafn greiðanda: ${metadata.payerName}`)
    lines.push(`Netfang greiðanda: ${metadata.payerEmail}`)
    lines.push(`Kennitala greiðanda: ${metadata.payerNationalId}`)
    lines.push(`Heimilisfang greiðanda: ${metadata.payerAddress}`)
    lines.push(`Póstnúmer greiðanda: ${metadata.payerPostalCode}`)
    lines.push(`Staður greiðanda: ${metadata.payerPlace}`)
  } else if (payment.paymentFlowMetadata.landspitaliType === 'directGrant') {
    const metadata = payment.paymentFlowMetadata
    lines.push(`Styrktarsjóður: ${metadata.grantChargeItemCode}`) // TODO: Perhaps send the name of the grant and not the "id"?
    lines.push(`Verkefni: ${metadata.project}`)
    lines.push(`Fjárhæð: ${metadata.amountISK}`)
    lines.push(`Nafn greiðanda: ${metadata.payerName}`)
    lines.push(`Netfang greiðanda: ${metadata.payerEmail}`)
    lines.push(`Kennitala greiðanda: ${metadata.payerNationalId}`)
    lines.push(`Heimilisfang greiðanda: ${metadata.payerAddress}`)
    lines.push(`Póstnúmer greiðanda: ${metadata.payerPostalCode}`)
    lines.push(`Staður greiðanda: ${metadata.payerPlace}`)
    lines.push(`Skýring á styrk: ${metadata.payerGrantExplanation}`)
  }

  return lines.join('\n')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // TODO: Perhaps validate the body
  const payment = req.body as PaymentCallbackPayload

  // TODO: Validate the callback and make sure it is actually coming from trusted source
  if (payment.type !== 'success') {
    // TODO: What should I do here?
    // Look into libs/application/api/payment/src/lib/payment-callback.controller.ts
    return res.status(200).send('')
  }

  const apolloClient = initApollo({})

  if (
    payment.paymentFlowMetadata.landspitaliType !== 'directGrant' &&
    payment.paymentFlowMetadata.landspitaliType !== 'memorialCard'
  ) {
    return res
      .status(400) // TODO: Check how the payment solution handles this kind of error code
      .send(
        'Unsure what type of payment this is, missing or invalid value for "landspitaliType" field in metadata',
      )
  }

  const subjectPrefix = environment.production ? '' : '[TEST] '

  res.status(200).send(generateMessage(payment))

  const response = await apolloClient.mutate<
    ContactUsZendeskTicketMutation,
    ContactUsZendeskTicketMutationVariables
  >({
    mutation: CONTACT_US_ZENDESK_TICKET_MUTATION,
    variables: {
      input: {
        name: payment.paymentFlowMetadata.payerName,
        email: ZENDESK_EMAIL,
        subject:
          payment.paymentFlowMetadata.landspitaliType === 'memorialCard'
            ? `${subjectPrefix}Minningarkort - Landspítali`
            : `${subjectPrefix}Beinn styrkur - Landspítali`,
        message: generateMessage(payment),
      },
    },
  })

  if (response.data?.contactUsZendeskTicket?.sent) {
    res.status(200).json({ message: 'Zendesk ticket submitted' })
  } else {
    res.status(500).json({ message: 'Failed to submit zendesk ticket' })
  }
}
