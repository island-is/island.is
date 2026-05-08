export interface DeliveryStation {
  name?: string | null
  type: string
  code: string
}

export interface PlateOrderValidation {
  hasError: boolean
  errorMessages?: Array<PlateOrderValidationMessage> | null
}

export interface PlateOrderValidationMessage {
  errorNo?: string | null
  defaultMessage?: string | null
}

export interface PlateOrder {
  permno: string
  regGroup: string
  frontType?: string | null
  rearType?: string | null
  deliveryStationType?: string
  deliveryStationCode?: string
  expressOrder: boolean
}

export interface PlateSize {
  plateSizeType?: string | null
  plateHeight?: number | null
  plateWidth?: number | null
}

export interface PlateOrderType {
  plateType?: string | null
  plateTypeName?: string | null
  plateBackground?: string | null
  plateForground?: string | null
  plateSizes: PlateSize[]
}

export interface PlateOrderMatrix {
  permno?: string | null
  plates: PlateOrderType[]
}

export interface CurrentPlates {
  permno?: string | null
  plateTypeCode?: string | null
  plateTypeName?: string | null
  plateBackground?: string | null
  plateForground?: string | null
  plateStatusCode?: string | null
  plateStatusName?: string | null
}

// Note: type=R and code=1 is the option "Pick up at Samgöngustofa"
export const SGS_DELIVERY_STATION_TYPE = 'R'
export const SGS_DELIVERY_STATION_CODE = '1'
