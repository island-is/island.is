import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

import { Inline, Stack } from '../..'
import { theme } from '@island.is/island-ui/theme'

import { InfoCard, InfoCardProps } from './InfoCard'

export type InfoCardItemProps = Omit<InfoCardProps, 'size' | 'variant'>

interface Props {
  cards: Array<InfoCardItemProps>
  variant?: 'detailed' | 'simple'
  columns?: 1 | 2 | 3
}

export const InfoCardGrid = ({ cards, variant, columns }: Props) => {
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  if (columns === 1 || isMobile) {
    return (
      <Stack space={3}>
        {cards.map((c) => (
          <InfoCard key={c.id} variant={variant} size={'large'} {...c} />
        ))}
      </Stack>
    )
  }

  return (
    <Inline space={3}>
      {cards.map((c, index) => (
        <InfoCard
          key={`${c.title}-${index}`}
          variant={variant}
          size={columns === 3 ? 'small' : 'medium'}
          {...c}
        />
      ))}
    </Inline>
  )
}
