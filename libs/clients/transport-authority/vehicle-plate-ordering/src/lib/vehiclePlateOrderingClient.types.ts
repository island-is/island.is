export interface DeliveryStation {
  name?: string | null
  codeType: string
}

export interface PlateOrder {
  permno: string
  frontType?: string | null
  rearType?: string | null
  deliveryMethodIsDeliveryStation: boolean
  deliveryStationCodeType?: string
  expressOrder: boolean
}
