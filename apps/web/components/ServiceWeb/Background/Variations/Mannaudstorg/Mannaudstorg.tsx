import { Box } from '@island.is/island-ui/core'
import { useNamespace } from '@island.is/web/hooks'

import * as styles from './Mannaudstorg.css'

interface MannaudstorgProps {
  namespace: Record<string, string>
}

export const Mannaudstorg = ({ namespace }: MannaudstorgProps) => {
  const n = useNamespace(namespace)
  return (
    <>
      <Box
        className={styles.bg}
        style={{
          backgroundImage: n(
            'mannaudstorgServiceWebBackgroundImage',
            'url(https://images.ctfassets.net/8k0h54kbe6bj/5MPtEcCql6t4YK2IdEr55B/4a874e12c84839a787631d803dd48364/FJA_Mannaudstorg_Vefsida_header_1440x750px_0522.png)',
          ),
        }}
      ></Box>
      <Box
        className={styles.foreground}
        style={{
          backgroundImage: n(
            'mannaudstorgServiceWebForegroundImage',
            'linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(https://images.ctfassets.net/8k0h54kbe6bj/5zLhMufXWTknM1HBpkjoea/73960da4ac0d1c2b91bf2cf3b3360219/mannaudstorg.png)',
          ),
        }}
      ></Box>
    </>
  )
}

export default Mannaudstorg
