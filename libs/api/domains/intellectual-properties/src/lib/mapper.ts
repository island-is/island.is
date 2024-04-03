import { HUXELSAPICommonTrademarkModelsTrademarks } from '@island.is/clients/intellectual-properties'
import { TrademarkSubType, TrademarkType } from './models/trademark.model'
import { isDefined } from '@island.is/shared/utils'
import { TranslationsDict } from '@island.is/cms-translations'

export const mapTrademarkType = (type: string | null | undefined) => {
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

export const formatReadableTrademarkType = (
  type: TrademarkType,
  namespace: TranslationsDict,
) => {
  switch (type) {
    case TrademarkType.MULTIMEDIA:
      return namespace?.['sp.intellectual-property:multimedia-trademark']
    case TrademarkType.ANIMATION:
      return namespace?.['sp.intellectual-property:animation-trademark']
    case TrademarkType.AUDIO:
      return namespace?.['sp.intellectual-property:audio-trademark']
    case TrademarkType.TEXT:
      return namespace?.['sp.intellectual-property:text-trademark']
    case TrademarkType.IMAGE:
      return namespace?.['sp.intellectual-property:image-trademark']
    case TrademarkType.TEXT_AND_IMAGE:
      return namespace?.['sp.intellectual-property:text-and-image-trademark']
    default:
      return undefined
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

export const mapFullAddress = (strings: Array<string | undefined>) => {
  const filteredStrings = strings.filter(isDefined)

  if (!filteredStrings.length) {
    return undefined
  }

  return filteredStrings.join(', ')
}
