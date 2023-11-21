import { ChargeItemCode } from '@island.is/shared/constants'

export const getChargeItemCodes = (): Array<string> => {
  return [ChargeItemCode.HEALTHCARE_LICENSE_CERTIFICATE.toString()]
}
