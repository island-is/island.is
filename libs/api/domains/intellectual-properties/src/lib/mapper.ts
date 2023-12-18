import { HUXELSAPICommonTrademarkModelsTrademarks } from '@island.is/clients/intellectual-properties'
import { TrademarkSubType, TrademarkType } from './models/trademark.model'

export const mapTrademarkType = (type: string | null | undefined) => {
  if (!type) {
    return null
  }

  switch (type) {
    case 'margmiðlunarmerki':
      return TrademarkType.MULTIMEDIA
    case 'hreyfimerki':
      return TrademarkType.ANIMATION
    case 'hljóðmerki':
      return TrademarkType.AUDIO
    case 'orðmerki':
      return TrademarkType.TEXT
    case 'myndmerki':
      return TrademarkType.IMAGE
    case 'orð- og myndmerki':
      return TrademarkType.TEXT_AND_IMAGE
    default:
      return TrademarkType.UNKNOWN
  }
}

export const mapTrademarkSubtype = (
  trademark: HUXELSAPICommonTrademarkModelsTrademarks | null | undefined,
) => {
  if (!trademark) {
    return null
  }
  return trademark.isFelagamerki
    ? TrademarkSubType.COLLECTIVE_MARK
    : trademark.certificationMark
    ? TrademarkSubType.CERTIFICATION_MARK
    : TrademarkSubType.TRADEMARK
}

export const mapFullAddress = (
  streetAddress?: string | undefined | null,
  postalCode?: string | undefined | null,
  city?: string | undefined | null,
) => {
  if (!streetAddress) {
    return `${postalCode + ' '}${city}`
  }

  if (!postalCode && !city) {
    return streetAddress
  }

  return `${streetAddress}, ${postalCode + ' '}${city}`
}
