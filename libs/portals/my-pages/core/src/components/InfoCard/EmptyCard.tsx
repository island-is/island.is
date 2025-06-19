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
import * as styles from './InfoCard.css'

interface EmptyCardProps {
  title: string
  description?: string
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
                marginBottom={isMobile || size === 'large' ? 1 : 0}
                textAlign={isMobile ? 'center' : 'left'}
              >
                {title}
              </Text>
              <Text textAlign={isMobile ? 'center' : 'left'}>
                {description}
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

export default EmptyCard
