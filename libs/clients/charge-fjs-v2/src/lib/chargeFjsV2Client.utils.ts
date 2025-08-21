import { Application, ExternalData } from '@island.is/application/types'

export const getPaymentIdFromExternalData = (application: Application) => {
  const externalData = application.externalData as
    | ExternalData
    | undefined
    | null
  if (!externalData?.createCharge?.data) {
    return
  }

  const { paymentUrl } = externalData.createCharge.data as {
    paymentUrl: string
  }
  const url = new URL(paymentUrl)
  const id = url.pathname.split('/').pop()
  return id ?? ''
}
