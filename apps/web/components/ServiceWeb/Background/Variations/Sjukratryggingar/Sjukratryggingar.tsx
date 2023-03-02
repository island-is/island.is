import { Box } from '@island.is/island-ui/core'
import { useNamespace } from '@island.is/web/hooks'

import * as styles from './Sjukratryggingar.css'

interface SjukratryggingarProps {
  namespace: Record<string, string>
}

export const Sjukratryggingar = ({ namespace }: SjukratryggingarProps) => {
  const n = useNamespace(namespace)
  return (
    <Box
      className={styles.container}
      style={{
        backgroundImage: n(
          'sjukratryggingarServiceWebBackgroundImageUrl',
          'url(https://images.ctfassets.net/8k0h54kbe6bj/7jzjEatxy6K1aAsKhT2f2V/a3ed3af04ae463c813dee0122a737197/Island-is-vefbanner__1_.jpg)',
        ),
      }}
    />
  )
}

export default Sjukratryggingar
