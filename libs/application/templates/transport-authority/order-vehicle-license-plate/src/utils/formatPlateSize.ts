import { FormatMessage } from '@island.is/localization'
import { PlateType, PlateSizeOption } from '../shared'
import { information } from '../lib/messages'

export const formatPlateSize = (
  formatMessage: FormatMessage,
  plate: PlateType | PlateSizeOption | undefined,
) => {
  if (!plate) return ''
  const code =
    'code' in plate
      ? plate.code
      : 'plateSizeType' in plate
      ? plate.plateSizeType
      : ''
  const height = plate.plateHeight
  const width = plate.plateWidth
  return formatMessage(information.labels.plateSize.plateSizeOptionTitle, {
    name: code,
    height,
    width,
  })
}
