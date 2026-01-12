import { useState } from 'react'
import AnimateHeight from 'react-animate-height'

import {
  Box,
  type BoxProps,
  Button,
  FocusableBox,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'

import { DetailedInfoCard, DetailedProps } from './DetailedInfoCard'
import { SimpleInfoCard } from './SimpleInfoCard'

export interface BaseProps {
  id: string
  title: string
  description: string
  eyebrow: string
  background?: BoxProps['background']
  size: 'large' | 'medium' | 'small'
  padding?: BoxProps['padding']
  borderColor?: BoxProps['borderColor']
  link: {
    label: string
    href: string
  }
}

export type InfoCardProps =
  | (BaseProps & {
      variant?: 'simple'
    })
  | (DetailedProps & {
      variant: 'detailed'
    })
  | (DetailedProps & {
      variant: 'detailed-reveal'
      revealMoreButtonProps?: {
        revealLabel: string
        hideLabel: string
        revealedText: string
      }
    })

export const InfoCard = ({ size, ...restOfProps }: InfoCardProps) => {
  const paddingValue = restOfProps.padding ?? 3
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)

  if (restOfProps.variant !== 'detailed-reveal') {
    return (
      <FocusableBox
        aria-label={restOfProps.title}
        component={LinkV2}
        href={restOfProps.link.href}
        background={restOfProps.background ?? 'white'}
        borderColor={restOfProps.borderColor ?? 'white'}
        color="blue"
        borderWidth="standard"
        width="full"
        borderRadius="large"
      >
        <Box width="full" padding={paddingValue}>
          {restOfProps.variant === 'simple' ? (
            <SimpleInfoCard size={size} {...restOfProps} />
          ) : (
            <DetailedInfoCard size={size} {...restOfProps} />
          )}
        </Box>
      </FocusableBox>
    )
  }

  const hasRevealProps =
    Boolean(restOfProps.revealMoreButtonProps?.revealLabel) &&
    Boolean(restOfProps.revealMoreButtonProps?.hideLabel) &&
    Boolean(restOfProps.revealMoreButtonProps?.revealedText)

  const revealRegionId = `${restOfProps.id}-reveal`

  return (
    <FocusableBox
      background={restOfProps.background ?? 'white'}
      borderColor={restOfProps.borderColor ?? 'white'}
      color="blue"
      borderWidth="standard"
      width="full"
      borderRadius="large"
      flexDirection="column"
      component="div"
    >
      <LinkV2 href={restOfProps.link.href}>
        <Box
          paddingX={paddingValue}
          paddingTop={paddingValue}
          paddingBottom={hasRevealProps ? 1 : paddingValue}
        >
          <DetailedInfoCard size={size} {...restOfProps} />
        </Box>
      </LinkV2>
      {hasRevealProps && (
        <Box paddingX={paddingValue} paddingBottom={paddingValue}>
          <Stack space={2}>
            <Button
              variant="text"
              size="small"
              icon={isAccordionOpen ? 'chevronUp' : 'chevronDown'}
              onClick={() => {
                setIsAccordionOpen((previousState) => !previousState)
              }}
              aria-expanded={isAccordionOpen}
              aria-controls={revealRegionId}
            >
              {isAccordionOpen
                ? restOfProps.revealMoreButtonProps?.hideLabel
                : restOfProps.revealMoreButtonProps?.revealLabel}
            </Button>
            <AnimateHeight duration={300} height={isAccordionOpen ? 'auto' : 0}>
              <Text variant="small" id={revealRegionId}>
                {restOfProps.revealMoreButtonProps?.revealedText}
              </Text>
            </AnimateHeight>
          </Stack>
        </Box>
      )}
    </FocusableBox>
  )
}
