import {
  Box,
  BoxProps,
  Button,
  Icon,
  LoadingDots,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Tooltip, m } from '@island.is/portals/my-pages/core'
import { useDocumentList } from '../../hooks/useDocumentList'
import { useMailAction } from '../../hooks/useMailActionV2'
import { ActiveDocumentType2 } from '../../lib/types'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'
import { downloadFile } from '../../utils/downloadDocument'
import * as styles from './DocumentActionBar.css'

export type DocumentActionBarProps = {
  onGoBack?: () => void
  spacing?: BoxProps['columnGap']
  archived?: boolean
  bookmarked?: boolean
}
export const DocumentActionBar: React.FC<DocumentActionBarProps> = ({
  onGoBack,
  spacing = 1,
  bookmarked,
  archived,
}) => {
  const {
    submitMailAction,
    archiveSuccess,
    bookmarkSuccess,
    dataSuccess,
    loading,
  } = useMailAction()

  const { activeDocument } = useDocumentContext()
  const { fetchObject, refetch } = useDocumentList()

  const { formatMessage } = useLocale()

  const isBookmarked =
    (bookmarked && !dataSuccess.unbookmark) || bookmarkSuccess
  const isArchived = (archived && !dataSuccess.unarchive) || archiveSuccess

  const getDocumentLink = (
    document: ActiveDocumentType2,
    type: 'pdf' | 'html',
  ) => {
    const uri =
      type === 'html'
        ? `data:text/html,${document.document.value ?? ''}`
        : `data:application/pdf;base64,${document.document.value ?? ''}`
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
                icon="fileTrayEmpty"
                iconType={isArchived ? 'filled' : 'outline'}
                onClick={async () => {
                  await submitMailAction(
                    isArchived ? 'unarchive' : 'archive',
                    activeDocument?.id ?? '',
                  )
                  refetch(fetchObject)
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
                    activeDocument?.id ?? '',
                  )
                  refetch(fetchObject)
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
        {activeDocument && activeDocument.document.value ? (
          activeDocument.document.type === 'HTML' ? (
            <Tooltip as="span" text={formatMessage(m.download)}>
              <a
                download={`${activeDocument.subject}.html`}
                href={getDocumentLink(activeDocument, 'html')}
                aria-label={formatMessage(m.getDocument)}
              >
                <Button
                  as="span"
                  unfocusable
                  circle
                  icon="download"
                  iconType="outline"
                  size="medium"
                  colorScheme="light"
                />
              </a>
            </Tooltip>
          ) : (
            <Tooltip text={formatMessage(m.download)}>
              <Button
                circle
                icon="download"
                iconType={'outline'}
                onClick={() =>
                  downloadFile({ doc: activeDocument, query: 'download' })
                }
                size="medium"
                colorScheme="light"
              />
            </Tooltip>
          )
        ) : undefined}
        {activeDocument && (
          <Tooltip text={formatMessage(m.print)}>
            <Button
              circle
              icon="print"
              iconType={'outline'}
              onClick={() =>
                downloadFile({
                  doc: activeDocument,
                })
              }
              size="medium"
              colorScheme="light"
            />
          </Tooltip>
        )}
      </Box>
    </>
  )
}
