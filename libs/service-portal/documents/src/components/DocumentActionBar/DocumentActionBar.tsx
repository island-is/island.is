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
import { ActiveDocumentType } from '../../lib/types'

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
    type: 'pdf' | 'html',
  ) => {
    const uri =
      type === 'html'
        ? `data:text/html,${document.document.html}`
        : `data:application/pdf;base64,${document.document.content}`
    return encodeURI(uri)
  }

  return (
    <>
      {onGoBack && (
        <Box>
          <button
            aria-label={formatMessage(m.closeActiveDocument)}
            onClick={onGoBack}
          >
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
        {activeDocument &&
          (activeDocument.document.content || activeDocument.document.html) && (
            <Tooltip as="span" text={formatMessage(m.download)}>
              <a
                download={`${activeDocument.subject}${
                  activeDocument.document.html ? '.html' : '.pdf'
                }`}
                href={getDocumentLink(
                  activeDocument,
                  activeDocument.document.html ? 'html' : 'pdf',
                )}
                aria-label={formatMessage(m.getDocument)}
              >
                <Button
                  as="span"
                  circle
                  icon="download"
                  iconType="outline"
                  size="medium"
                  colorScheme="light"
                />
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
