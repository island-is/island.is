import { Box, SkeletonLoader, Text } from '@island.is/island-ui/core'
import * as styles from './Property.css'
import { OJOI_INPUT_HEIGHT } from '../../lib/constants'
type Props = {
  name?: string
  value?: string | React.ReactNode
  loading?: boolean
}

export const Property = ({ name, value, loading = false }: Props) => {
  if (!value && !loading) {
    return null
  }

  return (
    <Box className={styles.propertyWrap}>
      {loading ? (
        <SkeletonLoader height={OJOI_INPUT_HEIGHT} borderRadius="standard" />
      ) : (
        <>
          <Box className={styles.property}>
            <Text fontWeight="semiBold">{name}</Text>
          </Box>
          <Box className={styles.property}>
            <Text>{value}</Text>
          </Box>
        </>
      )}
    </Box>
  )
}
