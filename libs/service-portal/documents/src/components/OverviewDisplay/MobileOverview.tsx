import { FC } from 'react'
import { m } from '@island.is/service-portal/core'
import { Box, Text, GridColumn, GridRow } from '@island.is/island-ui/core'
import { DocumentCategory } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useUserInfo } from '@island.is/auth/react'
import { DocumentRenderer } from '../../components/DocumentRenderer'
import { DocumentHeader } from '../../components/DocumentHeader'
import { DocumentActionBar } from '../../components/DocumentActionBar'
import { downloadFile } from '../../utils/downloadDocument'
import { ActiveDocumentType } from '../../lib/types'
import FocusLock from 'react-focus-lock'
import * as styles from './OverviewDisplay.css'

interface Props {
  activeDocument: ActiveDocumentType | null
  onPressBack: () => void
  onRefetch: () => void
  activeArchive: boolean
  activeBookmark: boolean
  loading?: boolean
  category?: DocumentCategory
}

export const MobileOverview: FC<Props> = ({
  activeDocument,
  onPressBack,
  onRefetch,
  activeArchive,
  activeBookmark,
  category,
}) => {
  useNamespaces('sp.documents')
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()

  if (!activeDocument) {
    return null
  }

  return (
    <GridRow>
      <GridColumn span="12/12" position="relative">
        <FocusLock autoFocus={false}>
          <Box className={styles.modalBase}>
            <Box className={styles.modalHeader}>
              <DocumentActionBar
                onGoBack={onPressBack}
                documentId={activeDocument.id}
                archived={activeArchive}
                bookmarked={activeBookmark}
                refetchInboxItems={onRefetch}
                activeDocument={activeDocument}
                onPrintClick={
                  activeDocument
                    ? () => downloadFile(activeDocument, userInfo)
                    : undefined
                }
              />
            </Box>
            <Box className={styles.modalContent}>
              <DocumentHeader
                avatar={activeDocument.img}
                sender={activeDocument.sender}
                date={activeDocument.date}
                category={category}
                subject={formatMessage(m.activeDocumentOpenAriaLabel, {
                  subject: activeDocument.subject,
                })}
              />
              <Text variant="h3" as="h3" marginBottom={3}>
                {activeDocument?.subject}
              </Text>
              {<DocumentRenderer document={activeDocument} />}
            </Box>
          </Box>
        </FocusLock>
      </GridColumn>
    </GridRow>
  )
}

export default MobileOverview
