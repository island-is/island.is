export interface DeliveryStation {
  name?: string | null
  code?: string | null
  type?: string | null
}

export interface PlateOrder {
  permno: string
  frontType?: string | null
  rearType?: string | null
  deliveryType: string
  deliveryStationCode: string
  expressOrder: boolean
}
