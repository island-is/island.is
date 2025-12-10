import { redirect } from 'react-router-dom'

import { WrappedLoaderFn } from '@island.is/portals/core'

import {
  GetPaymentDocument,
  GetPaymentQueryVariables,
  GetPaymentQuery,
} from './Payment.generated'
import { PaymentsPaths } from '../../lib/paths'

export type GetPaymentQueryResult = NonNullable<
  GetPaymentQuery['paymentsGetFlowAdmin']
>

export const paymentLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<GetPaymentQueryResult | Response> => {
    const id = params['paymentId']

    if (!id) throw new Error('Payment not found')

    const res = await client.query<GetPaymentQuery, GetPaymentQueryVariables>({
      query: GetPaymentDocument,
      fetchPolicy: 'network-only',
      variables: {
        id,
        includeEvents: true,
      },
    })

    if (res.error) {
      throw res.error
    }

    if (!res.data?.paymentsGetFlowAdmin) {
      return redirect(PaymentsPaths.Root)
    }

    return res.data.paymentsGetFlowAdmin
  }
}
