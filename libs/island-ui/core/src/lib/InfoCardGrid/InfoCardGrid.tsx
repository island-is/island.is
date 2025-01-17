import { useEffect, useMemo, useState } from 'react'
import { useWindowSize } from 'react-use'

import { Box, BoxProps, Text } from '../..'
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
  notFoundText?: string
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
  notFoundText,
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

  const cardsToRender = useMemo(() => {
    return cards.map((c, index) => (
      <InfoCard
        key={`${c.title}-${index}`}
        background={cardsBackground}
        borderColor={cardsBorder}
        variant={variant}
        size={isMobile ? 'medium' : cardSize}
        {...c}
      />
    ))
  }, [cardSize, cards, cardsBackground, cardsBorder, isMobile, variant])

  if (cards.length < 1) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        background="white"
        borderWidth="standard"
        borderRadius="lg"
        borderColor="blue200"
        flexDirection={['columnReverse', 'columnReverse', 'row']}
        columnGap={[2, 4, 8, 8, 20]}
        paddingY={[5, 8]}
        paddingX={[3, 3, 5, 10]}
        rowGap={[7, 7, 0]}
      >
        <Box display="flex" flexDirection="column" rowGap={1}>
          <Text variant={'h3'} as={'h3'} color="dark400">
            {notFoundText}
          </Text>
        </Box>
        {!isMobile && (
          <img width="240" src="/assets/sofa.svg" alt={notFoundText} />
        )}
      </Box>
    )
  }

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
      {cardsToRender}
    </Box>
  )
}
