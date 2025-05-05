import { FC } from 'react'
import FocusLock from 'react-focus-lock'
import {
  formatDate,
  getInitials,
  LoadModal,
  m,
} from '@island.is/portals/my-pages/core'
import {
  Box,
  Text,
  GridColumn,
  GridRow,
  Divider,
  AlertMessage,
} from '@island.is/island-ui/core'
import { DocumentsV2Category } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { DocumentRenderer } from '../DocumentRenderer/DocumentRenderer'
import { DocumentHeader } from '../DocumentHeader/DocumentHeader'
import { DocumentActionBar } from '../DocumentActionBar/DocumentActionBar'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'
import * as styles from './OverviewDisplay.css'
import { Reply } from '../../lib/types'
import ReplyHeader from '../Reply/ReplyHeader'
import { isDefined } from '@island.is/shared/utils'
import { useUserInfo } from '@island.is/react-spa/bff'
import ReplySent from '../Reply/ReplySent'
import ReplyContainer from '../Reply/ReplyContainer'
import { dateFormatWithTime } from '@island.is/shared/constants'

interface Props {
  onPressBack: () => void
  activeBookmark: boolean
  loading?: boolean
  category?: DocumentsV2Category
}

export const MobileOverview: FC<Props> = ({
  onPressBack,
  activeBookmark,
  category,
  loading,
}) => {
  useNamespaces('sp.documents')
  const { formatMessage } = useLocale()
  const {
    activeDocument,
    replyable,
    replies,
    setReplies,
    setReplyOpen,
    hideDocument,
    setHideDocument,
    closedForMoreReplies,
  } = useDocumentContext()
  const { profile } = useUserInfo()

  if (loading) {
    return <LoadModal />
  }

  if (!activeDocument) {
    return null
  }

  const toggleReply = (id?: string | null) => {
    const updatedReplies: Reply = {
      ...replies,
      comments:
        replies?.comments?.map((reply) =>
          reply.id === id ? { ...reply, hide: !reply.hide } : reply,
        ) || [],
    }
    setReplies(updatedReplies)
  }

  const toggleDocument = () => {
    setHideDocument(!hideDocument)
  }

  return (
    <FocusLock autoFocus={false}>
      <Box className={styles.modalBase}>
        <Box className={styles.modalHeader}>
          <DocumentActionBar
            onGoBack={onPressBack}
            bookmarked={activeBookmark}
            isReplyable={replyable}
            onReply={() => setReplyOpen(true)}
          />
        </Box>
        <Box className={styles.modalContent} onClick={toggleDocument}>
          <DocumentHeader
            avatar={activeDocument.img}
            sender={activeDocument.sender}
            date={activeDocument.date}
            category={category}
            subjectAriaLabel={formatMessage(m.activeDocumentOpenAriaLabel, {
              subject: activeDocument.subject,
            })}
            subject={activeDocument.subject}
            actions={activeDocument.actions}
          />
          {!hideDocument && <DocumentRenderer doc={activeDocument} />}
        </Box>
        <ReplyContainer />
      </Box>
    </FocusLock>
  )
}

export default MobileOverview
