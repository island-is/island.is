import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Inline,
  Text,
  ArrowLink,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import * as styles from './HeroBanner.css'
import { HeroImage } from '../../../../components/svg'
import { StatisticBox, HeroTiles } from './components'
import { ArrOfStatistics } from '../../../../types/interfaces'
import { useIsMobile } from '../../../../hooks'
import localization from '../../Home.json'
import { LogoText } from '../../../../components'
import { useCallback, useState } from 'react'

interface HeroBannerProps {
  statistics: ArrOfStatistics
}

export const HeroBanner = ({ statistics }: HeroBannerProps) => {
  const { isMobile } = useIsMobile()
  const loc = localization['heroBanner']

  const [_height, setHeight] = useState(null)
  const [_width, setWidth] = useState(null)
  const div = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height)
      setWidth(node.getBoundingClientRect().width)
    }
  }, [])

  console.log('_height', _height)
  console.log('_width', _width)

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
              <Stack space={3}>
                <LogoText />
                <HeroImage className={styles.heroImage} />
              </Stack>
              <StatisticBox
                statistic={statistics?.casesInReview?.toLocaleString('de-DE')}
              />
              <Text>{loc.introText}</Text>
              <ArrowLink href={loc.arrowLink.internalLink.href}>
                {loc.arrowLink.internalLink.text}
              </ArrowLink>
              <ArrowLink href={loc.arrowLink.externalLink.href}>
                {loc.arrowLink.externalLink.text}
              </ArrowLink>
            </Stack>
          </Box>
        ) : (
          <GridRow className={styles.rowAlign}>
            <GridColumn span={['6/12']}>
              <Stack space={4}>
                <LogoText />
                <Stack space={3}>
                  <Text dataTestId="heroIntro">{loc.introText}</Text>
                  <Inline justifyContent="spaceBetween">
                    <ArrowLink href={loc.arrowLink.internalLink.href}>
                      {loc.arrowLink.internalLink.text}
                    </ArrowLink>
                    <ArrowLink href={loc.arrowLink.externalLink.href}>
                      {loc.arrowLink.externalLink.text}
                    </ArrowLink>
                  </Inline>
                </Stack>
              </Stack>
            </GridColumn>
            <GridColumn span={'6/12'}>
              <HeroImage className={styles.heroImage} />
              <Box className={styles.alignTiles}>
                <HeroTiles space={2} columns={[1]}>
                  <StatisticBox
                    statistic={statistics?.casesInReview?.toLocaleString(
                      'de-DE',
                    )}
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
