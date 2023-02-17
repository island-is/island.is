import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './StatisticBox.css'
type StatisticProps = {
  label: string
  statistic: string
}

export const StatisticBox = ({ label, statistic }: StatisticProps) => {
  return (
    <Box className={styles.statisticBox}>
      <Text variant="h4" color="blue400">
        {label}
      </Text>
      <Text variant="h2">{statistic}</Text>
    </Box>
  )
}
export default StatisticBox
