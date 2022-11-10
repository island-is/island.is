import { Application } from '@island.is/application/api/core'
import { ExternalData } from '@island.is/application/types'

export const getChargeId = (
  application: Pick<Application, 'externalData'>,
): string | undefined => {
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
