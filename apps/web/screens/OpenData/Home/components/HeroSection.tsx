import React from 'react'

import { Box, Hidden, Text } from '@island.is/island-ui/core'
import { GridContainer } from '@island.is/island-ui/core'

import * as styles from '../Index.css'

interface TranslationFn {
  (key: string, fallback: string): string
}

interface HeroSectionProps {
  n: TranslationFn
}

export const HeroSection: React.FC<HeroSectionProps> = ({ n }) => {
  return (
    <Box paddingY={[4, 5, 6]}>
      <GridContainer>
        <Box
          display="flex"
          flexDirection={['column', 'column', 'row']}
          alignItems="flexStart"
        >
          <Box style={{ flex: '1 1 65%', paddingRight: '2rem' }}>
            <Text variant="h1" as="h1" marginBottom={2}>
              {n('heroTitle', 'Opin Gögn')}
            </Text>
            <Text marginBottom={2}>
              {n(
                'heroDescription1',
                'Hér finnur þú opin gagnasöfn frá íslenskum stjórnvöldum og stofnunum.',
              )}
            </Text>
            <Text>
              {n(
                'heroDescription2',
                'Gögnin eru aðgengileg til niðurhals og endurnýtingar og veita innsýn í ólik málefni samfélagsins. Þú getur leitað, síað og nálgast gögn frá mörgum ólikum aðilum á einum stað.',
              )}
            </Text>
          </Box>
          <Hidden below="md">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              style={{ flex: '0 0 35%' }}
            >
              <img
                src="/assets/opendata/header.svg"
                alt=""
                className={styles.heroImage}
              />
            </Box>
          </Hidden>
        </Box>
      </GridContainer>
    </Box>
  )
}

export default HeroSection
