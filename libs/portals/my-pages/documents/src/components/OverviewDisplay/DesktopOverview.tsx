import { DocumentsV2Category } from '@island.is/api/schema'
import { Box, LoadingDots } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { SERVICE_PORTAL_HEADER_HEIGHT_LG } from '@island.is/portals/my-pages/constants'
import { m } from '@island.is/portals/my-pages/core'
import { FC } from 'react'
import { useDocumentList } from '../../hooks/useDocumentList'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'
import { DocumentHeader } from '../DocumentHeader/DocumentHeader'
import { DocumentRenderer } from '../DocumentRenderer/DocumentRenderer'
import NoPDF from '../NoPDF/NoPDF'
import ReplyContainer from '../Reply/ReplyContainer'
import * as styles from './OverviewDisplay.css'

interface Props {
  activeBookmark: boolean
  loading?: boolean
  category?: DocumentsV2Category
}

export const DesktopOverview: FC<Props> = ({
  activeBookmark,
  category,
  loading,
}) => {
  useNamespaces('sp.documents')
  const { formatMessage } = useLocale()

  const {
    activeDocument,
    replyState,
    hideDocument,
    setHideDocument,
    setReplyState,
  } = useDocumentContext()
  const { activeArchive } = useDocumentList()

  if (loading) {
    return (
      <Box
        position="sticky"
        style={{ top: SERVICE_PORTAL_HEADER_HEIGHT_LG + 50 }}
        paddingLeft={8}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          paddingTop={6}
        >
          <LoadingDots />
        </Box>
      </Box>
    )
  }

  if (!activeDocument) {
    return <NoPDF />
  }

  const toggleDocument = () => {
    setHideDocument(!hideDocument)
  }

  return (
    <Box
      marginLeft={8}
      marginTop={3}
      padding={5}
      paddingTop={0}
      borderRadius="large"
      background="white"
      className={styles.docWrap}
      width="full"
    >
      <DocumentHeader
        avatar={activeDocument.img}
        sender={activeDocument.sender}
        date={activeDocument.date}
        category={category}
        subjectAriaLabel={formatMessage(m.activeDocumentOpenAriaLabel, {
          subject: activeDocument.subject,
        })}
        subject={activeDocument.subject}
        actionBar={{
          archived: activeArchive,
          bookmarked: activeBookmark,
          isReplyable: replyState?.closedForMoreReplies
            ? false
            : replyState?.replyable,
          onReply: () =>
            setReplyState((prev) => ({ ...prev, replyOpen: true })),
        }}
        actions={activeDocument.actions}
        onClick={toggleDocument}
      />

      {!hideDocument && <DocumentRenderer doc={activeDocument} />}

      <ReplyContainer />

      {activeDocument?.id && (
        <Box className={styles.reveal}>
          <button
            onClick={() => {
              document.getElementById(`button-${activeDocument?.id}`)?.focus()
            }}
          >
            {formatMessage(m.backToList)}
          </button>
        </Box>
      )}
    </Box>
  )
}

export default DesktopOverview
