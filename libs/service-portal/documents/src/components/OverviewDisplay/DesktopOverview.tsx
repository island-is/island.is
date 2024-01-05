import { FC } from 'react'
import { m } from '@island.is/service-portal/core'
import { Box, LoadingDots } from '@island.is/island-ui/core'
import { DocumentCategory } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useUserInfo } from '@island.is/auth/react'
import { DocumentRenderer } from '../DocumentRenderer'
import { DocumentHeader } from '../DocumentHeader'
import { downloadFile } from '../../utils/downloadDocument'
import { ActiveDocumentType } from '../../lib/types'
import * as styles from './OverviewDisplay.css'
import NoPDF from '../NoPDF/NoPDF'
import { SERVICE_PORTAL_HEADER_HEIGHT_LG } from '@island.is/service-portal/constants'

interface Props {
  activeDocument: ActiveDocumentType | null
  onRefetch: () => void
  activeArchive: boolean
  activeBookmark: boolean
  loading?: boolean
  category?: DocumentCategory
}

export const DesktopOverview: FC<Props> = ({
  activeDocument,
  onRefetch,
  activeArchive,
  activeBookmark,
  category,
  loading,
}) => {
  useNamespaces('sp.documents')
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()

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
          activeDocument: activeDocument,
          documentId: activeDocument.id,
          archived: activeArchive,
          bookmarked: activeBookmark,
          refetchInboxItems: onRefetch,
          onPrintClick: activeDocument
            ? () => downloadFile(activeDocument, userInfo)
            : undefined,
        }}
      />
      <Box>{<DocumentRenderer document={activeDocument} />}</Box>
    </Box>
  )
}

export default DesktopOverview
