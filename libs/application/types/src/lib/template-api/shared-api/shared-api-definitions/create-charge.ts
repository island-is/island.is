import { Application } from '../../../Application'
import { defineTemplateApi } from '../../TemplateApi'

export interface ExtraData {
  name: string
  value: string
}

export interface BasicChargeItem {
  code: string
  quantity?: number
  amount?: number // Is used to set a dynamic charge amount based on the application data
}

export interface CreateChargeParameters {
  organizationId: string
  chargeItems:
    | BasicChargeItem[]
    | ((application: Application) => BasicChargeItem[])
  extraData?:
    | ExtraData[]
    | ((application: Application) => ExtraData[] | undefined)
}

export const CreateChargeApi = defineTemplateApi<CreateChargeParameters>({
  action: 'createCharge',
  namespace: 'Payment',
})
