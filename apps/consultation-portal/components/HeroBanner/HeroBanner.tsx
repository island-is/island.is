import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Inline,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import * as styles from './HeroBanner.css'

import { HeroLogo, HeroLogoMobile, LESchoolMobile } from '../svg'
import { StatisticBox } from '..'
import HeroTiles from './components/HeroTiles'
import { ArrOfStatistics } from '../../types/interfaces'
import Splash from '../svg/Splash'
import { useIsMobile } from '../../hooks'
import IntroText from './components/IntroText'
import ArrowLink from './components/ArrowLink'

interface HeroBannerProps {
  statistics: ArrOfStatistics
}

export const HeroBanner = ({ statistics }: HeroBannerProps) => {
  const { isMobile } = useIsMobile()
  return (
    <Box
      style={{
        borderBottom: `1px solid ${theme.color.blue200}`,
      }}
      background="blue100"
      display="flex"
      flexDirection={'column'}
    >
      <GridContainer>
        {isMobile ? (
          <Box paddingY={6}>
            <Stack space={2}>
              <HeroLogoMobile />
              <LESchoolMobile />
              <IntroText />
              <ArrowLink isReadMore />
              <ArrowLink />
            </Stack>
          </Box>
        ) : (
          <GridRow className={styles.rowAlign}>
            <GridColumn span={['6/12']}>
              <Stack space={4}>
                <HeroLogo />
                <Stack space={3}>
                  <IntroText />
                  <Inline justifyContent="spaceBetween">
                    <ArrowLink isReadMore />
                    <ArrowLink />
                  </Inline>
                </Stack>
              </Stack>
            </GridColumn>
            <GridColumn span={'6/12'}>
              <Box className={styles.bg}>
                <Splash />
              </Box>
              <Box className={styles.alignTiles}>
                <HeroTiles space={2} columns={[1]}>
                  <StatisticBox
                    label="Til umsagnar"
                    statistic={statistics?.casesInReview?.toLocaleString(
                      'de-DE',
                    )}
                    text="mál"
                  />
                </HeroTiles>
              </Box>
            </GridColumn>
          </GridRow>
        )}
      </GridContainer>
    </Box>
  )
}
export default HeroBanner
