import { Box } from '@island.is/island-ui/core'
import { useNamespace } from '@island.is/web/hooks'

import * as styles from './Utlendingastofnun.css'

interface UtlendingastofnunProps {
  namespace: Record<string, string>
}

export const Utlendingastofnun = ({ namespace }: UtlendingastofnunProps) => {
  const n = useNamespace(namespace)
  return (
    <Box
      className={styles.container}
      style={{
        backgroundImage: n(
          'utlendingastofnunServiceWebBackgroundImageUrl',
          'url(https://images.ctfassets.net/8k0h54kbe6bj/5mLtktr3VMHq4JevjHhSAV/528243a5149435c0d8294861fed96086/__jo__nustvefur_U__tlendingastofnun_-_Header.png)',
        ),
      }}
    />
  )
}

export default Utlendingastofnun
