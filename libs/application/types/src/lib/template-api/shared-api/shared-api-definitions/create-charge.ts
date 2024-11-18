import { Application } from '../../../Application'
import { defineTemplateApi } from '../../TemplateApi'

export interface ExtraData {
  name: string
  value: string
}

export interface ChargeCodeItem {
  code: string
  quantity?: number
}

export interface CreateChargeParameters {
  organizationId: string
  chargeCodeItems:
    | ChargeCodeItem[]
    | ((application: Application) => ChargeCodeItem[])
  extraData?:
    | ExtraData[]
    | ((application: Application) => ExtraData[] | undefined)
}

export const CreateChargeApi = defineTemplateApi<CreateChargeParameters>({
  action: 'createCharge',
  namespace: 'Payment',
})
