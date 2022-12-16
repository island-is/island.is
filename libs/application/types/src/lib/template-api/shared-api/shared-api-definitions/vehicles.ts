import { defineTemplateApi } from '../../TemplateApi'

const namespace = 'VehiclesShared'

export interface CurrentVehiclesParameters {
  showOwned?: boolean
  showCoOwned?: boolean
  showOperated?: boolean
}

export const CurrentVehiclesApi = defineTemplateApi<CurrentVehiclesParameters>({
  action: 'currentVehicles',
  namespace,
})
