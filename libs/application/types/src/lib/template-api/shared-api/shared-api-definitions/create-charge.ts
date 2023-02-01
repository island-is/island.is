import { Application } from '../../../Application'
import { defineTemplateApi } from '../../TemplateApi'

export interface ExtraData {
  name: string
  value: string
}

export interface CreateChargeParameters {
  organizationId: string
  chargeItemCodes: string[] | ((application: Application) => string[])
  extraData?:
    | ExtraData[]
    | ((application: Application) => ExtraData[] | undefined)
}

export const CreateChargeApi = defineTemplateApi<CreateChargeParameters>({
  action: 'createCharge',
  namespace: 'Payment',
})
