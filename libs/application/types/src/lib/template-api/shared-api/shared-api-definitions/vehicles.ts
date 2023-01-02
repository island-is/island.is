import { defineTemplateApi } from '../../TemplateApi'

const namespace = 'VehiclesShared'

// Note: These constraint fields are OR-ed toghether, that is:
// if you set { showOwner: true, showCoOwned: true }, it will return
// vehicles where you are either (main)owner OR co-owner
export interface CurrentVehiclesParameters {
  // If true, will return vehicles where you are the main owner
  showOwned?: boolean
  // If true, will return vehicles where you are the co-owner
  showCoOwned?: boolean
  // If true, will return vehicles where you are the operator
  showOperated?: boolean
}

export const CurrentVehiclesApi = defineTemplateApi<CurrentVehiclesParameters>({
  action: 'currentVehicles',
  namespace,
})
