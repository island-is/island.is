import {
  Icon,
  Box,
  BoxProps,
  LoadingDots,
  Button,
} from '@island.is/island-ui/core'
import { useSubmitMailAction } from '../../utils/useSubmitMailAction'
import * as styles from './DocumentActionBar.css'
import { GetDocumentListInput } from '@island.is/api/schema'
import { Tooltip, m } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { ActiveDocumentType } from '../../screens/Overview/Overview'

export type DocumentActionBarProps = {
  onPrintClick?: () => void
  onGoBack?: () => void
  refetchInboxItems?: (input?: GetDocumentListInput) => void
  spacing?: BoxProps['columnGap']
  documentId: string
  archived?: boolean
  bookmarked?: boolean
  activeDocument?: ActiveDocumentType
}
export const DocumentActionBar: React.FC<DocumentActionBarProps> = ({
  onGoBack,
  onPrintClick,
  spacing = 1,
  documentId,
  bookmarked,
  archived,
  refetchInboxItems,
  activeDocument,
}) => {
  const {
    submitMailAction,
    archiveSuccess,
    bookmarkSuccess,
    loading,
    dataSuccess,
  } = useSubmitMailAction({ messageId: documentId })

  const { formatMessage } = useLocale()

  const isBookmarked =
    (bookmarked && !dataSuccess.unbookmark) || bookmarkSuccess
  const isArchived = (archived && !dataSuccess.unarchive) || archiveSuccess

  const getDocumentLink = (
    document: ActiveDocumentType,
    type: 'pdf' | 'text',
  ) => encodeURI(`data:application/pdf;${type},${document.document.content}`)

  return (
    <>
      {onGoBack && (
        <Box>
          <button onClick={onGoBack}>
            <Icon color="blue400" icon="arrowBack" />
          </button>
        </Box>
      )}
      <Box className={styles.filterBtns} display="flex" columnGap={spacing}>
        {!loading && (
          <>
            <Tooltip
              text={formatMessage(
                isArchived ? m.removeFromStorage : m.addToStorage,
              )}
            >
              <Button
                circle
                icon="archive"
                iconType={isArchived ? 'filled' : 'outline'}
                onClick={async () => {
                  await submitMailAction(isArchived ? 'unarchive' : 'archive')
                  if (refetchInboxItems) {
                    refetchInboxItems()
                  }
                }}
                size="medium"
                colorScheme="light"
              />
            </Tooltip>
            <Tooltip
              text={formatMessage(
                isBookmarked ? m.removeFavorite : m.addFavorite,
              )}
            >
              <Button
                circle
                icon="star"
                iconType={isBookmarked ? 'filled' : 'outline'}
                onClick={async () => {
                  await submitMailAction(
                    isBookmarked ? 'unbookmark' : 'bookmark',
                  )
                  if (refetchInboxItems) {
                    refetchInboxItems()
                  }
                }}
                size="medium"
                colorScheme="light"
              />
            </Tooltip>
          </>
        )}
        {loading && (
          <Box display="flex" alignItems="center">
            <LoadingDots />
          </Box>
        )}
        {activeDocument && (
          <Tooltip placement="top" as="span" text={formatMessage(m.download)}>
            <a
              download={activeDocument.subject}
              href={getDocumentLink(
                activeDocument,
                activeDocument.document.fileType === 'pdf' ? 'pdf' : 'text', // TODO NEEDS FURHTER INVESTIGATION NOT CORRECT ATM
              )}
            >
              <Button variant="ghost" size="small" circle icon="download" />
            </a>
          </Tooltip>
        )}
        {onPrintClick && (
          <Tooltip text={formatMessage(m.print)}>
            <Button
              circle
              icon="print"
              iconType={'outline'}
              onClick={onPrintClick}
              size="medium"
              colorScheme="light"
            />
          </Tooltip>
        )}
      </Box>
    </>
  )
}
