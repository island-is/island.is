export interface DeliveryStation {
  name?: string | null
  type: string
  code: string
}

export interface PlateOrder {
  permno: string
  frontType?: string | null
  rearType?: string | null
  deliveryStationType?: string
  deliveryStationCode?: string
  expressOrder: boolean
}
