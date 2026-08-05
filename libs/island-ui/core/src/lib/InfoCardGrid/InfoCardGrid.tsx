import { useWindowSize } from 'react-use'

import { Box, BoxProps } from '../..'
import { theme } from '@island.is/island-ui/theme'

import * as styles from './InfoCard.css'
import { InfoCard, InfoCardProps } from './InfoCard'

export type InfoCardItemProps = Omit<
  InfoCardProps,
  'size' | 'variant' | 'background' | 'padding'
>

interface Props {
  cards: Array<InfoCardItemProps>
  variant?: 'detailed' | 'simple'
  maxColumnCount?: 1 | 2 | 3
  cardsBackground?: BoxProps['background']
  cardsBorder?: BoxProps['borderColor']
  notFoundText?: string
}

type CardSize = 'small' | 'medium' | 'large'

const mapColumnCountToCardSize = (
  columns: Props['maxColumnCount'],
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
  maxColumnCount,
}: Props) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.sm

  const cardSize = mapColumnCountToCardSize(maxColumnCount, isMobile)

  return (
    <Box
      hidden={cards.length < 1}
      className={
        cardSize === 'small'
          ? styles.gridContainerMaxThreeColumn
          : cardSize === 'medium'
          ? styles.gridContainerMaxTwoColumns
          : styles.gridContainerMaxOneColumn
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
