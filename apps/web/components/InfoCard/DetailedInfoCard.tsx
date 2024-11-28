import * as React from 'react'
import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

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
import { theme } from '@island.is/island-ui/theme'
import { isDefined } from '@island.is/shared/utils'

import { BaseProps } from './InfoCard'
import * as styles from './InfoCard.css'

const eyebrowColor = 'blueberry600'

export type DetailedProps = BaseProps & {
  logo?: string
  logoAlt?: string
  subEyebrow?: string
  //max 5 lines
  detailLines?: Array<{
    icon: IconMapIcon
    text: string
  }>
  tags?: Array<ActionCardProps['tag']>
}

export const DetailedInfoCard = ({
  title,
  description,
  type = 'default',
  eyebrow,
  subEyebrow,
  detailLines,
  tags,
  logo,
  logoAlt,
  link,
}: DetailedProps) => {
  const [isTablet, setIsTablet] = useState(false)
  const { width } = useWindowSize()

  useEffect(() => {
    if (width < theme.breakpoints.lg) {
      return setIsTablet(true)
    }
    setIsTablet(false)
  }, [width])

  const renderLogo = () => {
    if (!logo) {
      return null
    }

    return (
      <Box style={{ flex: '0 0 40px' }}>
        <img height={40} src={logo} alt={logoAlt} />
      </Box>
    )
  }

  const renderDetails = () => {
    if (!detailLines?.length) {
      return null
    }

    return (
      <Box marginTop={2}>
        <Stack space={1}>
          {detailLines?.slice(0, 5).map((d, index) => (
            <Box
              key={index}
              display="flex"
              flexDirection={'row'}
              alignItems="center"
            >
              <Icon
                icon={d.icon}
                size="small"
                type="outline"
                color="blue400"
                useStroke
              />
              <Box marginLeft={2}>
                <Text variant="medium">{d.text}</Text>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    )
  }

  const renderTags = () => {
    if (!tags?.length) {
      return null
    }

    return (
      <Inline space={1}>
        {tags
          .map((tag) => {
            if (!tag) {
              return null
            }
            return <Tag variant={tag.variant}>{tag.label}</Tag>
          })
          .filter(isDefined)}
      </Inline>
    )
  }

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
        {subEyebrow ? (
          <Box>
            <Text fontWeight="semiBold" variant="eyebrow" color={eyebrowColor}>
              {eyebrow}
            </Text>
            <Text fontWeight="light" variant="eyebrow" color={eyebrowColor}>
              {subEyebrow}
            </Text>
          </Box>
        ) : (
          <Text variant="eyebrow" color={eyebrowColor}>
            {eyebrow}
          </Text>
        )}
        {renderLogo()}
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
              {description && (
                <Box flexGrow={1} marginTop={1}>
                  <Text>{description}</Text>
                </Box>
              )}
            </GridColumn>
            <GridColumn span="4/12">{renderDetails()}</GridColumn>
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
        {renderDetails()}
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
        <Box marginTop={3} display="flex" justifyContent="spaceBetween">
          {renderTags()}
          <Box display="flex" alignItems="flexEnd">
            {renderCta()}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
