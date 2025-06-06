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

interface EmptyCardProps {
  title: string
  description: string
  img?: string
  size?: 'small' | 'large'
}

export const EmptyCard: React.FC<EmptyCardProps> = ({
  title,
  description,
  img,
  size = 'small',
}) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const isTablet = width < theme.breakpoints.lg && !isMobile

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
            paddingY="p2"
            paddingX={3}
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
          >
            <Box marginRight={3}>
              <Text variant="h3" as="p">
                {title}
              </Text>
              <Text>{description}</Text>
            </Box>
            <Box>
              <Box
                alt=""
                component="img"
                src={img ?? './assets/images/sofa.svg'}
                margin={3}
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

export default EmptyCard
