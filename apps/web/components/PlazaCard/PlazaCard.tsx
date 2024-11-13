import * as React from 'react'

import {
  Box,
  Button,
  Icon,
  IconMapIcon,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { ActionCardProps } from '@island.is/island-ui/core/types'

import * as styles from './PlazaCard.css'

const eyebrowColor = 'blueberry600'

interface Props {
  title: string
  text: string
  logo?: string
  logoAlt?: string
  eyebrow?: string
  subEyebrow?: string
  detailLines?: Array<{
    icon: IconMapIcon
    text: string
  }>
  tag?: ActionCardProps['tag']
  cta?: ActionCardProps['cta']
}

export const PlazaCard = ({
  title,
  text,
  eyebrow,
  subEyebrow,
  detailLines,
  tag,
  logo,
  logoAlt,
  cta,
}: Props) => {
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

  const renderEyebrow = () => {
    if (!eyebrow) {
      return null
    }

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

  const renderDetails = () => {
    if (!detailLines?.length) {
      return null
    }

    return (
      <Box marginTop={2}>
        <Stack space={1}>
          {detailLines?.map((d, index) => (
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
              <Box marginLeft={1}>
                <Text variant="medium">{d.text}</Text>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    )
  }

  const renderTag = () => {
    if (!tag) {
      return null
    }

    return <Tag variant={tag.variant}>{tag.label}</Tag>
  }

  const renderCta = () => {
    if (!cta) {
      return null
    }

    return (
      <Button
        {...(cta.buttonType ?? { variant: cta.variant })}
        size={cta.size ?? 'small'}
        onClick={cta.onClick}
        disabled={cta.disabled}
        icon={cta.icon}
        iconType={cta.iconType}
        fluid={cta.fluid}
      >
        {cta.label}
      </Button>
    )
  }

  return (
    <Box background="white" className={styles.container}>
      <Box paddingX={4} paddingY={3}>
        {renderEyebrow()}
        <Text variant="h3" color="blue400">
          {title}
        </Text>
        {text && (
          <Box marginTop={1}>
            <Text>{text}</Text>
          </Box>
        )}
        {renderDetails()}
        <Box marginTop={3} display="flex" justifyContent="spaceBetween">
          {renderTag()}
          {renderCta()}
        </Box>
      </Box>
    </Box>
  )
}
