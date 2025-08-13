import type { NextApiRequest, NextApiResponse } from 'next'

import type { PaymentCallbackPayload } from '@island.is/api/domains/landspitali'
import initApollo from '@island.is/web/graphql/client'
import {
  WebLandspitaliSendDirectGrantPaymentConfirmationEmailMutation,
  WebLandspitaliSendDirectGrantPaymentConfirmationEmailMutationVariables,
  WebLandspitaliSendMemorialCardPaymentConfirmationEmailMutation,
  WebLandspitaliSendMemorialCardPaymentConfirmationEmailMutationVariables,
} from '@island.is/web/graphql/schema'
import {
  SEND_LANDSPITALI_DIRECT_GRANT_PAYMENT_CONFIRMATION_EMAIL,
  SEND_LANDSPITALI_MEMORIAL_CARD_PAYMENT_CONFIRMATION_EMAIL,
} from '@island.is/web/screens/queries/Landspitali'

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

  if (payment.paymentFlowMetadata.landspitaliPaymentType === 'DirectGrant') {
    const response = await apolloClient.mutate<
      WebLandspitaliSendDirectGrantPaymentConfirmationEmailMutation,
      WebLandspitaliSendDirectGrantPaymentConfirmationEmailMutationVariables
    >({
      mutation: SEND_LANDSPITALI_DIRECT_GRANT_PAYMENT_CONFIRMATION_EMAIL,
      variables: {
        input: {
          amountISK: payment.paymentFlowMetadata.amountISK,
          grantChargeItemCode: payment.paymentFlowMetadata.grantChargeItemCode,
          payerAddress: payment.paymentFlowMetadata.payerAddress,
          payerEmail: payment.paymentFlowMetadata.payerEmail,
          payerName: payment.paymentFlowMetadata.payerName,
          payerNationalId: payment.paymentFlowMetadata.payerNationalId,
          payerPostalCode: payment.paymentFlowMetadata.payerPostalCode,
          payerPlace: payment.paymentFlowMetadata.payerPlace,
          payerGrantExplanation:
            payment.paymentFlowMetadata.payerGrantExplanation,
          project: payment.paymentFlowMetadata.project,
        },
      },
    })
    if (
      response.data?.webLandspitaliSendDirectGrantPaymentConfirmationEmail
        ?.success
    ) {
      res.status(200).json({ message: 'Email sent' })
    } else {
      res.status(500).json({ message: 'Failed to send email' })
    }
  } else if (
    payment.paymentFlowMetadata.landspitaliPaymentType === 'MemorialCard'
  ) {
    const response = await apolloClient.mutate<
      WebLandspitaliSendMemorialCardPaymentConfirmationEmailMutation,
      WebLandspitaliSendMemorialCardPaymentConfirmationEmailMutationVariables
    >({
      mutation: SEND_LANDSPITALI_MEMORIAL_CARD_PAYMENT_CONFIRMATION_EMAIL,
      variables: {
        input: {
          amountISK: payment.paymentFlowMetadata.amountISK,
          payerName: payment.paymentFlowMetadata.payerName,
          payerEmail: payment.paymentFlowMetadata.payerEmail,
          payerNationalId: payment.paymentFlowMetadata.payerNationalId,
          payerAddress: payment.paymentFlowMetadata.payerAddress,
          payerPostalCode: payment.paymentFlowMetadata.payerPostalCode,
          payerPlace: payment.paymentFlowMetadata.payerPlace,
          fundChargeItemCode: payment.paymentFlowMetadata.fundChargeItemCode,
          inMemoryOf: payment.paymentFlowMetadata.inMemoryOf,
          recipientAddress: payment.paymentFlowMetadata.recipientAddress,
          recipientName: payment.paymentFlowMetadata.recipientName,
          recipientPlace: payment.paymentFlowMetadata.recipientPlace,
          recipientPostalCode: payment.paymentFlowMetadata.recipientPostalCode,
          senderSignature: payment.paymentFlowMetadata.senderSignature,
        },
      },
    })
    if (
      response.data?.webLandspitaliSendMemorialCardPaymentConfirmationEmail
        ?.success
    ) {
      res.status(200).json({ message: 'Email sent' })
    } else {
      res.status(500).json({ message: 'Failed to send email' })
    }
  }

  return res.status(400).json({ message: 'Unknown payment type' })
}
