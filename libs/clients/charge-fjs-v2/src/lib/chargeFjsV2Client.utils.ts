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

  console.log('************************************************')
  console.log('getPaymentIdFromExternalData paymentUrl', paymentUrl)
  console.log('************************************************')

  const url = new URL(paymentUrl)
  const id = url.pathname.split('/').pop()

  console.log('************************************************')
  console.log('getPaymentIdFromExternalData id', id)
  console.log('************************************************')

  return id ?? ''
}
