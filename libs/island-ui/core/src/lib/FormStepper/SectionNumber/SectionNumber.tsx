import React, { FC } from 'react'
import cn from 'classnames'

import { Colors } from '@island.is/island-ui/theme'

import { Box } from '../../Box/Box'
import { Icon } from '../../IconRC/Icon'
import { SectionNumberColumn } from '../SectionNumberColumn/SectionNumberColumn'
import * as types from '../types'
import * as styles from './SectionNumber.css'

const bulletColors = {
  [types.FormStepperThemes.PURPLE]: 'purple200',
  [types.FormStepperThemes.BLUE]: 'blue200',
  [types.FormStepperThemes.GREEN]: 'mint300',
  [types.FormStepperThemes.RED]: 'red200',
}
const lineColors = {
  [types.FormStepperThemes.PURPLE]: {
    active: 'purple400',
    inActive: 'purple200',
  },
  [types.FormStepperThemes.BLUE]: { active: 'blue400', inActive: 'blue200' },
  [types.FormStepperThemes.GREEN]: { active: 'mint600', inActive: 'mint300' },
  [types.FormStepperThemes.RED]: { active: 'red600', inActive: 'red200' },
}

interface SectionNumberProps {
  theme?: types.FormStepperThemes
  currentState: 'active' | 'previous' | 'next'
  number: number
  lineHeight?: number
  isHistory?: boolean
}

export const SectionNumber: FC<React.PropsWithChildren<SectionNumberProps>> = ({
  theme = types.FormStepperThemes.BLUE,
  currentState,
  number,
  lineHeight,
  isHistory = false,
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
        className={cn(
          isHistory ? styles.historyProgressLine : styles.progressLine,
          'pl',
        )}
        style={{ height: `${lineHeight}px` }}
      />
      {(currentState === 'next' && (
        <Icon color={currentBulletColor} size="small" icon="ellipse" />
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
            <Icon color="white" size="small" icon="checkmark" />
          )) ||
            number}
        </Box>
      )}
    </SectionNumberColumn>
  )
}
