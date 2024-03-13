import { Box } from '@island.is/island-ui/core'
import dirtyClean from '@island.is/regulations-tools/dirtyClean-browser'
import { HTMLText } from '@island.is/regulations-tools/types'

import * as s from './StjornartidindiAdvertDisplay.css'

export type StjornartidindiAdvertDisplayProps = {
  advertText: string
  isLegacy: boolean
}

export const StjornartidindiAdvertDisplay = ({
  advertText,
  isLegacy,
}: StjornartidindiAdvertDisplayProps) => {
  if (!advertText) {
    return null
  }

  return (
    <Box
      className={isLegacy ? s.bodyText : s.bodyText}
      dangerouslySetInnerHTML={{ __html: dirtyClean(advertText as HTMLText) }}
    ></Box>
  )
}
