import {
  Icon,
  Box,
  BoxProps,
  LoadingDots,
  Button,
} from '@island.is/island-ui/core'
import { useUserInfo } from '@island.is/auth/react'
import { Tooltip, m } from '@island.is/portals/my-pages/core'
import { useLocale } from '@island.is/localization'
import { ActiveDocumentType2 } from '../../lib/types'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'
import { useDocumentList } from '../../hooks/useDocumentList'
import { useMailAction } from '../../hooks/useMailActionV2'
import { downloadFile } from '../../utils/downloadDocumentV2'
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
  const userInfo = useUserInfo()

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
        {activeDocument && activeDocument.document.value && (
          <Tooltip as="span" text={formatMessage(m.download)}>
            <a
              download={`${activeDocument.subject}${
                activeDocument.document.type === 'HTML' ? '.html' : '.pdf'
              }`}
              href={getDocumentLink(
                activeDocument,
                activeDocument.document.type === 'HTML' ? 'html' : 'pdf',
              )}
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
        )}
        {activeDocument && (
          <Tooltip text={formatMessage(m.print)}>
            <Button
              circle
              icon="print"
              iconType={'outline'}
              onClick={() => downloadFile(activeDocument, userInfo)}
              size="medium"
              colorScheme="light"
            />
          </Tooltip>
        )}
      </Box>
    </>
  )
}
