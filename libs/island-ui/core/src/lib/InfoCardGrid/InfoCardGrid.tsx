import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

import { BoxProps, GridColumn, GridContainer, GridRow, Stack } from '../..'
import { theme } from '@island.is/island-ui/theme'

import chunk from 'lodash/chunk'

import { InfoCard, InfoCardProps } from './InfoCard'

export type InfoCardItemProps = Omit<
  InfoCardProps,
  'size' | 'variant' | 'background'
>

interface Props {
  cards: Array<InfoCardItemProps>
  variant?: 'detailed' | 'simple'
  columns?: 1 | 2 | 3
  cardsBackground?: BoxProps['background']
}

export const InfoCardGrid = ({
  cards,
  cardsBackground,
  variant,
  columns,
}: Props) => {
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  if (columns === 1) {
    return (
      <Stack space={2}>
        {cards.map((c) => (
          <InfoCard
            key={c.id}
            variant={variant}
            size={'large'}
            background={cardsBackground}
            {...c}
          />
        ))}
      </Stack>
    )
  }

  const cardNodes = cards.map((c, index) => (
    <GridColumn span="5/12">
      <InfoCard
        key={`${c.title}-${index}`}
        background={cardsBackground}
        variant={variant}
        size={columns === 3 ? 'small' : 'medium'}
        {...c}
      />
    </GridColumn>
  ))

  const nodeChunks = chunk(cardNodes, columns)

  return (
    <GridContainer>
      {nodeChunks.map((column) => (
        <GridRow rowGap={1}>{column}</GridRow>
      ))}
    </GridContainer>
  )
}
