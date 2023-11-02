import { Application, ExternalData } from '@island.is/application/types'

export const getPaymentIdFromExternalData = (application: Application) => {
  const externalData = application.externalData as
    | ExternalData
    | undefined
    | null
  if (!externalData?.createCharge?.data) {
    return
  }

  const { id: chargeId } = externalData.createCharge.data as {
    id: string
  }

  return chargeId
}
