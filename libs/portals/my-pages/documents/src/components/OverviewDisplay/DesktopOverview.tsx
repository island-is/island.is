import { DocumentsV2Category } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Divider,
  LoadingDots,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { SERVICE_PORTAL_HEADER_HEIGHT_LG } from '@island.is/portals/my-pages/constants'
import { formatDate, getInitials, m } from '@island.is/portals/my-pages/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { dateFormatWithTime } from '@island.is/shared/constants'
import { isDefined } from '@island.is/shared/utils'
import { FC } from 'react'
import { useDocumentList } from '../../hooks/useDocumentList'
import { Reply } from '../../lib/types'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'
import { DocumentHeader } from '../DocumentHeader/DocumentHeader'
import { DocumentRenderer } from '../DocumentRenderer/DocumentRenderer'
import NoPDF from '../NoPDF/NoPDF'
import ReplyContainer from '../Reply/ReplyContainer'
import ReplyHeader from '../Reply/ReplyHeader'
import ReplySent from '../Reply/ReplySent'
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
  const { profile } = useUserInfo()

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
          isReplyable: replyable,
          onReply: () => setReplyOpen(true),
        }}
        actions={activeDocument.actions}
      />
      <Box>
        {!hideDocument && <DocumentRenderer doc={activeDocument} />}
        {replies?.comments?.map((reply) => (
          <Box
            onClick={() => toggleReply(reply.id)}
            key={reply.id}
            cursor="pointer"
          >
            <Box paddingY={1}>
              <Divider />
            </Box>
            <ReplyHeader
              initials={getInitials(reply.author ?? '')}
              title={reply.author ?? activeDocument.subject}
              hasEmail={isDefined(profile.email)}
              subTitle={formatDate(reply?.createdDate, dateFormatWithTime.is)}
              displayEmail={false}
            />
            {!reply.hide && (
              <ReplySent
                date={reply.createdDate}
                id={reply.id}
                body={reply.body}
              />
            )}
          </Box>
        ))}
        {/* {If document is marked replyable, we render the reply form} */}
        {replyable && <ReplyContainer sender={activeDocument.sender} />}
        {closedForMoreReplies && (
          <AlertMessage
            type="info"
            message={
              'Ekki er hægt að svara þessum skilaboðum því sendandi hefur lokað fyrir frekari svör í þessu samtali.'
            }
          />
        )}
      </Box>
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
