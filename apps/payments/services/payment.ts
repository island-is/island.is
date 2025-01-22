import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  PaymentsApi,
  PaymentsApiConfiguration,
} from '@island.is/clients/payments'
import getConfig from 'next/config'

let api: null | PaymentsApi = null

export const getPaymentsApi = () => {
  if (api) {
    return api
  }

  const {
    serverRuntimeConfig: { paymentApiEndpoint },
  } = getConfig()

  api = new PaymentsApi(
    new PaymentsApiConfiguration({
      fetchApi: createEnhancedFetch({
        name: 'paymentsNextjsApi',
      }),
      basePath: paymentApiEndpoint,
    }),
  )

  return api
}
