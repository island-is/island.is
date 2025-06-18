import { Box } from '@island.is/island-ui/core'
import * as styles from '../../OverviewDisplay/OverviewDisplay.css'
import ReplyContainer from '../ReplyContainer'

export const MobileReply = () => {
  return (
    <Box className={styles.modalBase}>
      <Box className={styles.modalContent}>
        <ReplyContainer />
      </Box>
    </Box>
  )
}

export default MobileReply
