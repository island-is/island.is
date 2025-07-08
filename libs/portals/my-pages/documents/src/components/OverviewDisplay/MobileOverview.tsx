import { FC, useEffect, useState } from 'react'
import {
  LoadModal,
  m,
  useScrollDirection,
} from '@island.is/portals/my-pages/core'
import { Box } from '@island.is/island-ui/core'
import { DocumentsV2Category } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { DocumentRenderer } from '../DocumentRenderer/DocumentRenderer'
import { DocumentHeader } from '../DocumentHeader/DocumentHeader'
import { DocumentActionBar } from '../DocumentActionBar/DocumentActionBar'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'
import * as styles from './OverviewDisplay.css'
import MobileReply from '../Reply/Mobile/MobileReply'
import cn from 'classnames'

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
  const { activeDocument, replyState, hideDocument, setReplyState } =
    useDocumentContext()
  const [scrollingDown, setScrollingDown] = useState(false)
  const scrollDirection = useScrollDirection()

  useEffect(() => {
    if (scrollDirection === 'down' && !scrollingDown) {
      setScrollingDown(true)
    } else if (scrollDirection === 'up' && scrollingDown) {
      setScrollingDown(false)
    }
  }, [scrollDirection, scrollingDown])

  if (loading) {
    return <LoadModal />
  }

  if (!activeDocument) {
    return null
  }

  return (
    <Box className={styles.modalBase}>
      <Box
        className={cn(styles.modalHeader, {
          [styles.modalHeaderScrollingUp]: !scrollingDown,
        })}
      >
        <DocumentActionBar
          onGoBack={onPressBack}
          bookmarked={activeBookmark}
          isReplyable={
            replyState?.closedForMoreReplies ? false : replyState?.replyable
          }
          onReply={() =>
            setReplyState((prev) => ({ ...prev, replyOpen: true }))
          }
        />
      </Box>
      {!replyState?.replyOpen && (
        <Box className={styles.modalContent}>
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
      )}
      <MobileReply />
      <Box className={styles.reveal}>
        <button onClick={onPressBack}>
          {formatMessage(m.backToDocumentsList)}
        </button>
      </Box>
    </Box>
  )
}

export default MobileOverview
