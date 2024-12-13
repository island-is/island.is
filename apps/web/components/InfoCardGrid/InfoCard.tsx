import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

import { Box, FocusableBox, LinkV2 } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

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

export const InfoCard = ({ size, ...restOfProps }: InfoCardProps) => {
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const { width } = useWindowSize()

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  const cardSize = isMobile ? 'small' : size

  console.log(isMobile)
  console.log(cardSize)
  return (
    <FocusableBox
      className={
        size === 'large'
          ? styles.infoCardWide
          : size === 'small'
          ? styles.infoCardSmall
          : styles.infoCard
      }
      component={LinkV2}
      href={restOfProps.link.href}
      background={size === 'small' ? 'yellow100' : 'white'}
      borderColor="white"
      color="blue"
      borderWidth="standard"
      width="full"
      borderRadius="standard"
    >
      <Box width="full" paddingX={4} paddingY={3}>
        {restOfProps.variant === 'detailed' ? (
          <DetailedInfoCard size={cardSize} {...restOfProps} />
        ) : (
          <SimpleInfoCard size={cardSize} {...restOfProps} />
        )}
      </Box>
    </FocusableBox>
  )
}
