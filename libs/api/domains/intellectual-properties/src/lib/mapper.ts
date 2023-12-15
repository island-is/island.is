import { HUXELSAPICommonTrademarkModelsTrademarks } from '@island.is/clients/intellectual-properties'
import { TrademarkSubType, TrademarkType } from './models/trademark.model'

export const mapTrademarkType = (type: string | null | undefined) => {
  if (!type) {
    return null
  }
  return type === 'margmiðlunarmerki'
    ? TrademarkType.MULTIMEDIA
    : type === 'hreyfimerki'
    ? TrademarkType.ANIMATION
    : type === 'hljóðmerki'
    ? TrademarkType.AUDIO
    : type === 'orðmerki'
    ? TrademarkType.TEXT
    : type === 'myndmerki'
    ? TrademarkType.IMAGE
    : null
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
