import React from 'react'
import { useMeasure } from 'react-use'
import cn from 'classnames'
import {
  GridContainer,
  Box,
  GridRow,
  GridColumn,
  Stack,
  Text,
  Hyphen,
} from '@island.is/island-ui/core'
import { Section } from '@island.is/web/components'

import * as styles from './ChartsCard.treat'

export interface ChartsCardsProps {
  title: string
  subTitle?: string
  description: string
}

export const ChartsCard: React.FC<ChartsCardsProps> = ({
  title,
  subTitle,
  description,
  children,
}) => {
  const [ref, { width }] = useMeasure()

  const shouldStack = width < 360

  const items = (
    <Box
      ref={ref}
      display="flex"
      style={{ flexDirection: 'column' }}
      flexGrow={1}
      flexDirection={shouldStack ? 'columnReverse' : 'row'}
      alignItems="stretch"
      justifyContent="flexStart"
    >
      <Box
        style={{
          width: '100%',
          height: '128px',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
        background="purple100"
      >
        <Box padding={[2, 2, 4]}>
          {description && (
            <Text variant="eyebrow" color="purple600">
              {description}
            </Text>
          )}
          <Box display="flex" alignItems="center">
            <Box display="inlineFlex" flexGrow={1}>
              <Text variant="h3" color="purple600">
                <Hyphen>{title}</Hyphen>
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
      {subTitle && 
        <Box paddingLeft={[2, 15, 15]} padding={[2, 4, 4]} style={{ width: '100%', height: '100px' }}>
          <Text variant="h4">{subTitle}</Text>
        </Box>
      }
      <Box display="flex" justifyContent="center" style={{ width: '100%', height: '100%' }}>
        <Box style={subTitle ? { width: '85%', height: '361px' } : { width: '100%', height: '518px' }}>{children}</Box>
      </Box>
    </Box>
  )

  return <FrameWrapper>{items}</FrameWrapper>
}

const FrameWrapper = ({ children }) => {
  return (
    <Box
      className={cn(styles.card)}
      position="relative"
      borderRadius="large"
      overflow="visible"
      background="transparent"
      outline="none"
      borderColor="purple100"
      borderWidth="standard"
      //   padding={[2, 2, 4]}
    >
      {children}
    </Box>
  )
}

export default ChartsCard
