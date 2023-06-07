import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './StatisticBox.css'
import localization from '../../../../Home.json'

type StatisticProps = {
  statistic: string
}

export const StatisticBox = ({ statistic }: StatisticProps) => {
  const loc = localization['heroBanner']
  const renderStatistic = () => {
    if (statistic) {
      return `${statistic}`
    }
    return '-'
  }

  return (
    <Box className={styles.statisticBox}>
      <Text variant="h4" color="blue400">
        {loc.statisticBox.label}
      </Text>
      <Text variant="h2">{`${renderStatistic()} ${
        loc.statisticBox.text
      }`}</Text>
    </Box>
  )
}
export default StatisticBox
