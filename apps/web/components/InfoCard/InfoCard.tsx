import * as React from 'react'

import { Box, FocusableBox, LinkV2 } from '@island.is/island-ui/core'

import { DetailedInfoCard, DetailedProps } from './DetailedInfoCard'
import { SimpleInfoCard } from './SimpleInfoCard'
import * as styles from './InfoCard.css'

export interface BaseProps {
  title: string
  description: string
  eyebrow: string
  size: 'large' | 'medium' | 'small'
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

export const InfoCard = (props: InfoCardProps) => {
  return (
    <FocusableBox
      className={
        props.size === 'large'
          ? styles.infoCardWide
          : props.size === 'small'
          ? styles.infoCardSmall
          : styles.infoCard
      }
      component={LinkV2}
      href={props.link.href}
      background="white"
      borderColor="white"
      borderWidth="standard"
      width="full"
      borderRadius="standard"
    >
      <Box width="full" paddingX={4} paddingY={3}>
        {props.variant === 'detailed' ? (
          <DetailedInfoCard {...props} />
        ) : (
          <SimpleInfoCard {...props} />
        )}
      </Box>
    </FocusableBox>
  )
}
