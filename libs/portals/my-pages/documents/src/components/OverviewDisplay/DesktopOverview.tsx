import { DocumentsV2Category } from '@island.is/api/schema'
import { Box, Divider, LoadingDots } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { SERVICE_PORTAL_HEADER_HEIGHT_LG } from '@island.is/portals/my-pages/constants'
import { formatDate, getInitials, m } from '@island.is/portals/my-pages/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { dateFormatWithTime } from '@island.is/shared/constants'
import { isDefined } from '@island.is/shared/utils'
import { FC } from 'react'
import { useDocumentList } from '../../hooks/useDocumentList'
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

  const { activeDocument, replyable, replies } = useDocumentContext()
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

  return (
    <Box
      marginLeft={8}
      marginTop={3}
      padding={5}
      borderRadius="large"
      background="white"
      className={styles.docWrap}
    >
      <DocumentHeader
        avatar={activeDocument.img}
        sender={activeDocument.sender}
        date={activeDocument.date}
        category={category}
        subject={formatMessage(m.activeDocumentOpenAriaLabel, {
          subject: activeDocument.subject,
        })}
        actionBar={{
          archived: activeArchive,
          bookmarked: activeBookmark,
        }}
        actions={activeDocument.actions}
      />
      <Box>
        {<DocumentRenderer doc={activeDocument} />}
        {replies?.map((reply) => (
          <>
            <Box paddingY={3}>
              <Divider />
            </Box>
            <ReplyHeader
              initials={getInitials(profile.name)}
              title={profile.name}
              hasEmail={isDefined(profile.email)}
              subTitle={formatDate(reply?.date, dateFormatWithTime.is)}
            />
            <ReplySent
              date={reply.date}
              id={reply.id}
              reply={reply.reply}
              email={reply.email}
              intro={reply.intro}
            />
          </>
        ))}
        {/* {If document is marked replyable, we render the reply form} */}
        {replyable && <ReplyContainer sender={activeDocument.sender} />}
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
