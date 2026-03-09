import { Application, ExternalData } from '@island.is/application/types'

export const getPaymentIdFromExternalData = (application: Application) => {
  const externalData = application.externalData as
    | ExternalData
    | undefined
    | null
  if (!externalData?.createCharge?.data) {
    return
  }

  const { paymentUrl, request_id } = externalData.createCharge.data as {
    paymentUrl: string
    request_id: string
  }
  if (request_id) {
    return request_id
  }
  // fallback to paymentUrl if request_id is not set
  const url = new URL(paymentUrl)
  const id = url.pathname.split('/').pop()
  return id ?? ''
}
