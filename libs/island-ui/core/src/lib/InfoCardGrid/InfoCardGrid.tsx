import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

import { Box, BoxProps } from '../..'
import { theme } from '@island.is/island-ui/theme'

import * as styles from './InfoCard.css'
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
  cardsBorder?: BoxProps['borderColor']
}

type CardSize = 'small' | 'medium' | 'large'

const mapColumnCountToCardSize = (
  columns: Props['columns'],
  isMobile?: boolean,
): CardSize => {
  if (isMobile) {
    return 'large'
  }
  switch (columns) {
    case 1:
      return 'large'
    case 2:
      return 'medium'
    default:
      return 'small'
  }
}

export const InfoCardGrid = ({
  cards,
  cardsBackground,
  cardsBorder,
  variant,
  columns,
}: Props) => {
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()

  useEffect(() => {
    if (width < theme.breakpoints.sm) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  const cardSize = mapColumnCountToCardSize(columns, isMobile)

  return (
    <Box
      className={
        cardSize === 'small'
          ? styles.gridContainerThreeColumn
          : cardSize === 'medium'
          ? styles.gridContainerTwoColumn
          : styles.gridContainerOneColumn
      }
    >
      {cards.map((c, index) => (
        <InfoCard
          key={`${c.title}-${index}`}
          background={cardsBackground}
          borderColor={cardsBorder}
          variant={variant}
          size={isMobile ? 'medium' : cardSize}
          {...c}
        />
      ))}
    </Box>
  )
}
