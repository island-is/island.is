import { Box, Button, Checkbox, LinkV2, Text } from '@island.is/island-ui/core'
import React from 'react'
import * as styles from './ListViewCard.css'
import { CTAProps } from '../ActionCategoryCard/ActionCategoryCard'

type InfoItems = {
  icon?: React.ReactNode
  title: string
}

type CardProps = {
  infoItems: Array<InfoItems>
  onCheck?: (e: any) => void
  buttonLabel?: string
  checkboxLabel?: string
  cta: CTAProps
  icon?: React.ReactElement
  iconText?: string
  heading: string
  href: string
  checkboxId?: string
  checked?: boolean
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
}: CardProps) => {
  return (
    <Box>
      <Box
        display="flex"
        flexDirection="column"
        position="relative"
        justifyContent="flexStart"
        alignItems="flexStart"
        borderRadius="large"
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
        <LinkV2 href={href} passHref>
          <Text
            as="h4"
            variant="h4"
            color="blue400"
            truncate={false}
            title={heading}
            paddingBottom={3}
          >
            {heading}
          </Text>
        </LinkV2>
        {infoItems.map((item) => {
          return (
            <Box
              display="flex"
              flexDirection="row"
              width="full"
              paddingBottom={1}
            >
              <Box paddingRight={2}>{item.icon}</Box>
              <Text whiteSpace="nowrap" variant="small">
                {item.title}
              </Text>
            </Box>
          )
        })}
        <Box>
          <Checkbox
            label="Setja í samanburð"
            labelVariant="small"
            onChange={onCheck}
            id={checkboxId}
            checked={checked}
          />
        </Box>
        <Box paddingTop={3} width="full">
          <Button
            {...(cta.buttonType ?? { variant: cta.variant })}
            size={cta.size}
            fluid
            onClick={cta.onClick}
            disabled={cta.disabled}
            icon={cta.icon}
            iconType={cta.iconType}
            nowrap
          >
            {cta.label}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
