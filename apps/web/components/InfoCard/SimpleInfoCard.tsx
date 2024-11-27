import * as React from 'react'

import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  IconMapIcon,
  Inline,
  LinkV2,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { ActionCardProps } from '@island.is/island-ui/core/types'
import { isDefined } from '@island.is/shared/utils'

import { BaseProps } from './InfoCard'
import * as styles from './InfoCard.css'
import { useWindowSize } from 'react-use'
import { useEffect, useState } from 'react'
import { theme } from '@island.is/island-ui/theme'

const eyebrowColor = 'blueberry600'

export const SimpleInfoCard = ({
  title,
  text,
  type = 'default',
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

  const renderCta = () => {
    if (!link) {
      return null
    }

    return (
      <Button
        variant="text"
        size="small"
        icon="arrowForward"
        iconType="outline"
        nowrap
      >
        <LinkV2 href={link.href} newTab={true}>
          {link.label}
        </LinkV2>
      </Button>
    )
  }

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
    if (type === 'wide' && !isTablet) {
      return (
        <GridContainer>
          <GridRow direction="row">
            <GridColumn span="8/12">
              <Text variant="h3" color="blue400">
                {title}
              </Text>
              {text && (
                <Box flexGrow={1} marginTop={1}>
                  <Text>{text}</Text>
                </Box>
              )}
            </GridColumn>
            <GridColumn span="4/12">
              <Box
                height="full"
                width="full"
                display="flex"
                alignItems="flexEnd"
                justifyContent="flexEnd"
              >
                {renderCta()}
              </Box>
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
        {text && (
          <Box marginTop={1}>
            <Text>{text}</Text>
          </Box>
        )}
        <Box marginTop={1}>{renderCta()}</Box>
      </>
    )
  }

  return (
    <Box
      className={type === 'wide' ? styles.infoCardWide : styles.infoCard}
      background="white"
      width="full"
      borderRadius="standard"
    >
      <Box width="full" paddingX={4} paddingY={3}>
        {renderHeader()}
        {renderContent()}
      </Box>
    </Box>
  )
}
