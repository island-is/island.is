import React, { FC } from 'react'

import { Box, Icon } from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'

import SectionNumberColumn from '../SectionNumberColumn'

import * as styles from './SectionNumber.treat'
import { ProgressThemes } from '../../../../types'

const bulletColors = {
  [ProgressThemes.PURPLE]: 'purple200',
  [ProgressThemes.BLUE]: 'blue200',
  [ProgressThemes.GREEN]: 'mint300',
  [ProgressThemes.RED]: 'red200',
}
const lineColors = {
  [ProgressThemes.PURPLE]: { active: 'purple400', inActive: 'purple200' },
  [ProgressThemes.BLUE]: { active: 'blue400', inActive: 'blue200' },
  [ProgressThemes.GREEN]: { active: 'mint600', inActive: 'mint300' },
  [ProgressThemes.RED]: { active: 'red600', inActive: 'red200' },
}

interface SectionNumberProps {
  theme?: ProgressThemes
  currentState: 'active' | 'previous' | 'next'
  number: number
  lineHeight?: number
}

const SectionNumber: FC<SectionNumberProps> = ({
  theme = ProgressThemes.PURPLE,
  currentState,
  number,
  lineHeight,
}) => {
  const currentBulletColor = bulletColors[theme] as Colors
  const currentLineColor =
    currentState === 'previous'
      ? (lineColors[theme].active as Colors)
      : (lineColors[theme].inActive as Colors)
  const currentNumberColor =
    currentState === 'active'
      ? (lineColors[theme].active as Colors)
      : currentState === 'previous'
      ? (lineColors[theme].active as Colors)
      : (lineColors[theme].inActive as Colors)

  return (
    <SectionNumberColumn>
      <Box
        position="absolute"
        background={currentLineColor}
        className={styles.progressLine}
        style={{ height: `${lineHeight}px` }}
      />
      {(currentState === 'next' && (
        <Icon type="bullet" color={currentBulletColor} width="16" height="16" />
      )) || (
        <Box
          position="absolute"
          display="flex"
          alignItems="center"
          textAlign="center"
          background={currentNumberColor}
          justifyContent="center"
          pointerEvents="none"
          className={styles.number}
        >
          {(currentState === 'previous' && (
            <Icon type="check" color="white" width="16" height="16" />
          )) ||
            number}
        </Box>
      )}
    </SectionNumberColumn>
  )
}

export default SectionNumber
