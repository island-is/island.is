import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './FinanceLoans.css'

interface Props {
  data: Array<{ title: string; value?: string | number | null }>
}

export const FinanceLoansTableDetail = ({ data }: Props) => {
  return (
    <Box padding={1} marginBottom={4}>
      {data.map((item, i) => (
        <Box key={i} display="flex" flexWrap="wrap" className={styles.wrapper}>
          <Box className={styles.label}>
            <Text fontWeight="semiBold" variant="small" as="span">
              {item.title}{' '}
            </Text>
          </Box>
          <Text variant="small" as="span">
            {item.value ?? '-'}
          </Text>
        </Box>
      ))}
    </Box>
  )
}
