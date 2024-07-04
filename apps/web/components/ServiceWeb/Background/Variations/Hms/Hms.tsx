import { Box, Hidden } from '@island.is/island-ui/core'
import { useNamespace } from '@island.is/web/hooks'

import * as styles from './Hms.css'

interface HmsProps {
  namespace: Record<string, string>
}

export const Hms = ({ namespace }: HmsProps) => {
  const n = useNamespace(namespace)
  return (
    <Box className={styles.bg}>
      <Hidden below="lg">
        <Box
          className={styles.bgImageRight}
          style={{
            backgroundImage: n(
              'HmsServiceWebBackgroundImageRight',
              'url(https://images.ctfassets.net/8k0h54kbe6bj/32helFn0wzGc22pipgvRiZ/c621e78adfbc35d8d053f4bce49d44c8/HMS_-_mynd1.png)',
            ),
          }}
        ></Box>
        <Box
          className={styles.bgImageLeft}
          style={{
            backgroundImage: n(
              'HmsServiceWebBackgroundImageLeft',
              "url('https://images.ctfassets.net/8k0h54kbe6bj/69CU6NQKJcnfXnfgtu2zuQ/1e6994a71955f56e9383771637fd7da6/HMS_-_mynd2.png')",
            ),
          }}
        ></Box>
      </Hidden>
    </Box>
  )
}

export default Hms
