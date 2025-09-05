import { Box } from '@island.is/island-ui/core'
import * as styles from '../Reply.css'
import ReplyContainer from '../ReplyContainer'
import { useDocumentContext } from '../../../screens/Overview/DocumentContext'

export const MobileReply = () => {
  const { replyState } = useDocumentContext()

  return (
    <Box className={replyState?.replyOpen ? styles.modalBase : undefined}>
      <Box className={replyState?.replyOpen ? styles.modalContent : undefined}>
        <ReplyContainer />
      </Box>
    </Box>
  )
}

export default MobileReply
