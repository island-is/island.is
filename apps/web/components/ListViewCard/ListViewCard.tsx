import React from 'react'

import { Box, Button, Checkbox, LinkV2, Text } from '@island.is/island-ui/core'

import { CTAProps } from '../ActionCategoryCard/ActionCategoryCard'
import * as styles from './ListViewCard.css'

type InfoItems = {
  icon?: React.ReactNode
  title: string
}

type CardProps = {
  infoItems: Array<InfoItems>
  onCheck?: () => void
  buttonLabel?: string
  checkboxLabel?: string
  cta: CTAProps
  icon?: React.ReactElement
  iconText?: string
  heading: string
  href: string
  checkboxId?: string
  checked?: boolean
  subHeading?: string
  onCardClick?: () => void
}

export const ListViewCard = ({
  infoItems = [],
  onCheck,
  checkboxId,
  cta,
  icon,
  iconText,
  heading,
  checked,
  href,
  subHeading,
  onCardClick,
}: CardProps) => {
  return (
    <Box height="full">
      <Box
        height="full"
        display="flex"
        flexDirection="column"
        position="relative"
        justifyContent="flexStart"
        alignItems="flexStart"
        borderRadius="default"
        borderColor="blue200"
        borderWidth="standard"
        background="white"
        paddingY={3}
        paddingX={4}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          paddingBottom={2}
        >
          {icon && (
            <Box
              paddingRight={1}
              display="flex"
              alignItems="center"
              className={styles.icon}
            >
              {icon}
            </Box>
          )}
          {iconText && <Text variant="small">{iconText}</Text>}
        </Box>
        <Box onClick={onCardClick}>
          <LinkV2 href={href} passHref>
            <Text
              as="h3"
              variant="h4"
              color="blue400"
              truncate={false}
              paddingBottom={subHeading ? 0 : 3}
              lineHeight="sm"
            >
              {heading}
            </Text>
            {subHeading && (
              <Box style={{ paddingTop: '4px' }}>
                <Text
                  variant="eyebrow"
                  color="blue400"
                  truncate={false}
                  title={subHeading}
                  paddingBottom={3}
                  lineHeight="sm"
                >
                  {subHeading}
                </Text>
              </Box>
            )}
          </LinkV2>
        </Box>

        {infoItems.map((item) => {
          return (
            <Box
              key={item.title}
              display="flex"
              flexDirection="row"
              width="full"
              paddingBottom={1}
            >
              <Box paddingRight={2}>{item.icon}</Box>
              <Text whiteSpace="normal" variant="small">
                {item.title}
              </Text>
            </Box>
          )
        })}
        {checkboxId && (
          <Box>
            <Checkbox
              label="Setja í samanburð"
              labelVariant="small"
              onChange={onCheck}
              id={checkboxId}
              checked={checked}
            />
          </Box>
        )}
        <Box paddingTop={3} width="full" height="full">
          <Box
            display={'flex'}
            alignItems={'flexEnd'}
            height="full"
            width="full"
            style={{ cursor: cta.disabled ? 'not-allowed' : undefined }}
          >
            {cta.href ? (
              <Button
                {...(cta.buttonType ?? { variant: cta.variant })}
                size={cta.size}
                fluid
                disabled={cta.disabled}
                icon={cta.icon}
                iconType={cta.iconType}
                nowrap
              >
                <LinkV2 href={cta.href} newTab={true}>
                  {cta.label}
                </LinkV2>
              </Button>
            ) : (
              <Button
                {...(cta.buttonType ?? { variant: cta.variant })}
                size={cta.size}
                fluid
                onClick={cta.onClick && cta.onClick}
                disabled={cta.disabled}
                icon={cta.icon}
                iconType={cta.iconType}
                nowrap
              >
                {cta.label}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
