import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './Property.css'
type Props = {
  name?: string
  value?: string
}

export const Property = ({ name, value }: Props) => (
  <Box className={styles.propertyWrap}>
    <Box className={styles.property}>
      <Text fontWeight="semiBold">{name}</Text>
    </Box>
    <Box className={styles.property}>
      <Text>{value}</Text>
    </Box>
  </Box>
)
