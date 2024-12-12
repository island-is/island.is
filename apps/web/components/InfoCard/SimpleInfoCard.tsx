import * as React from 'react'
import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

import {
  Box,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  LinkV2,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import { BaseProps } from './InfoCard'
import * as styles from './InfoCard.css'

const eyebrowColor = 'blueberry600'

export const SimpleInfoCard = ({
  title,
  description,
  size = 'medium',
  eyebrow,
  link,
}: BaseProps) => {
  const [isTablet, setIsTablet] = useState(false)
  const { width } = useWindowSize()

  useEffect(() => {
    if (width < theme.breakpoints.lg) {
      return setIsTablet(true)
    }
    setIsTablet(false)
  }, [width])

  const renderHeader = () => {
    return (
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        marginBottom={3}
      >
        <Text variant="eyebrow" color={eyebrowColor}>
          {eyebrow}
        </Text>
      </Box>
    )
  }

  const renderContent = () => {
    if (size === 'large') {
      return (
        <GridContainer>
          <GridRow direction="row">
            <GridColumn span="12/12">
              <Text variant="h3" color="blue400">
                {title}
              </Text>
              {description && (
                <Box flexGrow={1} marginTop={1}>
                  <Text>{description}</Text>
                </Box>
              )}
            </GridColumn>
          </GridRow>
        </GridContainer>
      )
    }
    return (
      <>
        <Text variant="h3" color="blue400">
          {title}
        </Text>
        {description && (
          <Box marginTop={1}>
            <Text>{description}</Text>
          </Box>
        )}
      </>
    )
  }

  return (
    <>
      {renderHeader()}
      {renderContent()}
    </>
  )
}
