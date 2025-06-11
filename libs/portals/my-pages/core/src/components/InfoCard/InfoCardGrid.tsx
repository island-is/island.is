import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import React from 'react'
import { useWindowSize } from 'react-use'
import InfoCard, { InfoCardProps } from './InfoCard'
import * as styles from './InfoCard.css'

interface InfoCardGridProps {
  cards: InfoCardProps[]
  size?: 'small' | 'large'
  empty: {
    title: string
    description: string
    img?: string
  }
  variant?: 'default' | 'detail' | 'appointment' | 'link'
}

export const InfoCardGrid: React.FC<InfoCardGridProps> = ({
  cards,
  size = 'small',
  empty: { title: emptyTitle, description: emptyDescription, img },
  variant = 'default',
}) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const isTablet = width < theme.breakpoints.lg && !isMobile

  if (cards.length === 0) {
    return (
      <GridContainer>
        <GridRow rowGap={2} marginBottom={6}>
          <GridColumn
            span={size === 'small' && !isMobile && !isTablet ? '6/12' : '12/12'}
          >
            <Box
              border="standard"
              borderRadius="large"
              borderColor="blue200"
              paddingTop={isMobile ? 2 : 'p2'}
              paddingBottom={isMobile ? 5 : 'p2'}
              paddingX={isMobile ? 2 : 3}
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              flexDirection={isMobile ? 'columnReverse' : 'row'}
            >
              <Box marginRight={isMobile ? 0 : 3}>
                <Text
                  variant="h3"
                  as="p"
                  marginBottom={isMobile || size === 'large' ? 1 : 0}
                  textAlign={isMobile ? 'center' : 'left'}
                >
                  {emptyTitle}
                </Text>
                <Text textAlign={isMobile ? 'center' : 'left'}>
                  {emptyDescription}
                </Text>
              </Box>
              <Box>
                <Box
                  alt=""
                  component="img"
                  src={img ?? './assets/images/sofa.svg'}
                  margin={isMobile ? 3 : 1}
                  className={styles.smallImage}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="full"
                />
              </Box>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    )
  }

  return (
    <GridContainer>
      <GridRow rowGap={2} marginBottom={6}>
        {cards.map((card, index) => (
          <GridColumn
            span={size === 'small' && !isMobile && !isTablet ? '6/12' : '12/12'}
          >
            <InfoCard
              icon={card.icon}
              key={index}
              tags={card.tags}
              img={card.img}
              size={card.size ?? size ?? 'small'}
              title={card.title}
              description={card.description}
              to={card.to}
              detail={card.detail}
              variant={variant}
              appointment={card.appointment}
            />
          </GridColumn>
        ))}
      </GridRow>
    </GridContainer>
  )
}

export default InfoCardGrid
