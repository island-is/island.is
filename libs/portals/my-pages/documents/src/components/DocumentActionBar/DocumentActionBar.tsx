import {
  Box,
  BoxProps,
  Button,
  DropdownMenu,
  DropdownMenuProps,
  Icon,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Tooltip, m, useIsMobile } from '@island.is/portals/my-pages/core'
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
  isReplyable?: boolean
  onReply?: () => void
}
export const DocumentActionBar: React.FC<DocumentActionBarProps> = ({
  onGoBack,
  spacing = 1,
  bookmarked,
  archived,
  isReplyable,
  onReply,
}) => {
  const {
    submitMailAction,
    archiveSuccess,
    bookmarkSuccess,
    dataSuccess,
    loading,
  } = useMailAction()

  const { activeDocument, replyState, setReplyState } = useDocumentContext()
  const { fetchObject, refetch } = useDocumentList()
  const { formatMessage } = useLocale()
  const { isMobile } = useIsMobile()
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

  const downloadDocument =
    activeDocument?.document.type === 'HTML'
      ? {
          href: getDocumentLink(activeDocument, 'html'),
          render: () => (
            <a
              download={`${activeDocument.subject}.html`}
              href={getDocumentLink(activeDocument, 'html')}
              aria-label={formatMessage(m.getDocument)}
            >
              <Box
                display="flex"
                alignItems="center"
                width="full"
                paddingY={2}
                paddingX={1}
                borderBottomWidth="standard"
                borderColor="blue100"
              >
                <Box
                  marginLeft={[1, 1, 1, 2]}
                  marginRight={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon
                    icon="download"
                    type="outline"
                    size="small"
                    color="blue400"
                  />
                </Box>
                <Text variant="small" fontWeight="semiBold">
                  {formatMessage(m.download)}
                </Text>
              </Box>
              {/* <Divider thickness="standard" /> */}
            </a>
          ),
        }
      : {
          onClick: () =>
            activeDocument &&
            downloadFile({ doc: activeDocument, query: 'download' }),
        }

  const actions: DropdownMenuProps['items'] = [
    {
      title: formatMessage(m.print),
      icon: 'print',
      iconType: 'outline',
      onClick: activeDocument
        ? () =>
            downloadFile({
              doc: activeDocument,
            })
        : undefined,
    },
    {
      title: formatMessage(m.download),
      icon: 'download',
      iconType: 'outline',
      ...downloadDocument,
    },
    {
      title: isBookmarked
        ? formatMessage(m.removeFavorite)
        : formatMessage(m.addFavorite),
      icon: 'star',
      iconType: isBookmarked ? 'filled' : 'outline',
      onClick: async () => {
        await submitMailAction(
          isBookmarked ? 'unbookmark' : 'bookmark',
          activeDocument?.id ?? '',
        )
        refetch(fetchObject)
      },
    },
  ]

  if (isReplyable) {
    actions.push({
      title: formatMessage(m.replyDocument),
      icon: 'undo',
      iconType: 'outline',
      onClick: () => onReply?.(),
    })
  }

  const hideActions = !isMobile || (!replyState?.replyOpen && isMobile) //Display only if desktop or replyOpen is false and isMobile

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
        {!loading && hideActions && (
          <>
            {isReplyable && (
              <Tooltip text={formatMessage(m.reply)}>
                <Button
                  circle
                  icon="undo"
                  iconType="outline"
                  onClick={() => onReply?.()}
                  size="medium"
                  colorScheme="light"
                />
              </Tooltip>
            )}
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
      </Box>
      {hideActions && (
        <Tooltip text={formatMessage(m.actions)}>
          <DropdownMenu
            icon="ellipsisVertical"
            iconType="filled"
            items={[...actions].reverse()}
            disclosure={
              <span className={styles.actionsButton}>
                <Tooltip text={formatMessage(m.actions)}>
                  <Button
                    icon="ellipsisVertical"
                    iconType="filled"
                    size="small"
                    variant="text"
                    loading={loading}
                  />
                </Tooltip>
              </span>
            }
          ></DropdownMenu>
        </Tooltip>
      )}
      {replyState?.replyOpen && isMobile && (
        <Box>
          <Button
            circle
            icon="close"
            colorScheme="light"
            onClick={() =>
              setReplyState((prev) => ({ ...prev, replyOpen: false }))
            }
          />
        </Box>
      )}
    </>
  )
}
