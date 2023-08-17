import { HUXELSAPICommonTrademarkModelsTrademarks } from '@island.is/clients/intellectual-property'
import { TrademarkSubType, TrademarkType } from './models/getTrademark.model'

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
