import { useWindowSize } from 'react-use'

import { Box, type BoxProps } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import { InfoCard, type InfoCardProps } from './InfoCard'
import * as styles from './InfoCard.css'

export type InfoCardItemProps = Omit<
  InfoCardProps,
  'size' | 'variant' | 'background' | 'padding'
>

interface Props {
  cards: Array<InfoCardItemProps>
  variant?: 'detailed' | 'simple' | 'detailed-reveal'
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
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.sm

  const cardSize = mapColumnCountToCardSize(columns, isMobile)

  return (
    <Box
      hidden={cards.length < 1}
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
          padding={isMobile ? 2 : 3}
          borderColor={cardsBorder}
          variant={variant}
          size={isMobile ? 'medium' : cardSize}
          {...c}
        />
      ))}
    </Box>
  )
}
