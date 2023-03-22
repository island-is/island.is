import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './StatisticBox.css'
type StatisticProps = {
  label: string
  statistic: string
  text: string
}

export const StatisticBox = ({ label, statistic, text }: StatisticProps) => {
  const renderStatistic = () => {
    if (statistic) {
      return `${statistic} ${text}`
    }
    return '-'
  }

  return (
    <Box className={styles.statisticBox}>
      <Text variant="h4" color="blue400">
        {label}
      </Text>
      <Text variant="h2">{renderStatistic()}</Text>
    </Box>
  )
}
export default StatisticBox
