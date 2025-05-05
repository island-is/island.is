import { FC } from 'react'
import FocusLock from 'react-focus-lock'
import { LoadModal, m } from '@island.is/portals/my-pages/core'
import { Box, Text, GridColumn, GridRow } from '@island.is/island-ui/core'
import { DocumentsV2Category } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { DocumentRenderer } from '../DocumentRenderer/DocumentRenderer'
import { DocumentHeader } from '../DocumentHeader/DocumentHeader'
import { DocumentActionBar } from '../DocumentActionBar/DocumentActionBar'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'
import * as styles from './OverviewDisplay.css'

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
  const { activeDocument } = useDocumentContext()

  if (loading) {
    return <LoadModal />
  }

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
                bookmarked={activeBookmark}
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
                actions={activeDocument.actions}
              />
              <Text variant="h3" as="h3" marginBottom={3}>
                {activeDocument?.subject}
              </Text>
              {<DocumentRenderer doc={activeDocument} />}

              <Box className={styles.reveal}>
                <button onClick={onPressBack}>
                  {formatMessage(m.backToDocumentsList)}
                </button>
              </Box>
            </Box>
          </Box>
        </FocusLock>
      </GridColumn>
    </GridRow>
  )
}

export default MobileOverview
