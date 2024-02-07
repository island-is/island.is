import { Box, LoadingDots, Text } from '@island.is/island-ui/core'
import * as styles from './StatisticBox.css'
import localization from '../../../../Home.json'
import { useIsMobile } from '../../../../../../hooks'

type StatisticProps = {
  statistic: string
}

export const StatisticBox = ({ statistic }: StatisticProps) => {
  const { isMobile } = useIsMobile()
  const loc = localization['heroBanner']

  return (
    <Box className={styles.statisticBox}>
      <Text variant="h4" color="blue400">
        {loc.statisticBox.label}
      </Text>
      {statistic ? (
        <Text variant="h2">{`${statistic} ${loc.statisticBox.text}`}</Text>
      ) : (
        <Box paddingTop={1} paddingBottom={isMobile ? 0 : 1}>
          <LoadingDots />
        </Box>
      )}
    </Box>
  )
}
export default StatisticBox
