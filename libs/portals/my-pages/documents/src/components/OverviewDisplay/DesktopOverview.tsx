import { FC } from 'react'
import { m } from '@island.is/portals/my-pages/core'
import { Box, LoadingDots } from '@island.is/island-ui/core'
import { DocumentsV2Category } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { DocumentRenderer } from '../DocumentRenderer/DocumentRenderer'
import { DocumentHeader } from '../DocumentHeader/DocumentHeader'
import NoPDF from '../NoPDF/NoPDF'
import { SERVICE_PORTAL_HEADER_HEIGHT_LG } from '@island.is/portals/my-pages/constants'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'
import * as styles from './OverviewDisplay.css'
import { useDocumentList } from '../../hooks/useDocumentList'

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
  const { activeDocument } = useDocumentContext()
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
      <Box>{<DocumentRenderer doc={activeDocument} />}</Box>
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
