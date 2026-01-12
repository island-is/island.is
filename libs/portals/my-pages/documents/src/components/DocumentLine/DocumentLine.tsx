import cn from 'classnames'
import format from 'date-fns/format'
import { FC, useEffect, useRef, useState } from 'react'

import {
  DocumentV2,
  DocumentV2Action,
  DocumentV2Content,
} from '@island.is/api/schema'
import { Box, Icon, LoadingDots, Text, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ConfirmationModal, m } from '@island.is/portals/my-pages/core'
import { dateFormat } from '@island.is/shared/constants'
import {
  matchPath,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { useDocumentList } from '../../hooks/useDocumentList'
import { useIsChildFocusedorHovered } from '../../hooks/useIsChildFocused'
import { useMailAction } from '../../hooks/useMailActionV2'
import { DocumentsPaths } from '../../lib/paths'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'
import {
  useDocumentConfirmActionsLazyQuery,
  useGetDocumentInboxLineV3LazyQuery,
} from '../../queries/Overview.generated'
import { messages } from '../../utils/messages'
import { FavAndStash } from '../FavAndStash/FavAndStash'
import UrgentTag from '../UrgentTag/UrgentTag'
import AvatarImage from './AvatarImage'
import * as styles from './DocumentLine.css'
import { Reply } from '../../lib/types'

interface Props {
  documentLine: DocumentV2
  hasInitialFocus?: boolean
  img?: string
  setSelectLine?: (id: string) => void
  active: boolean
  asFrame?: boolean
  includeTopBorder?: boolean
  selected?: boolean
  bookmarked?: boolean
}

export const DocumentLine: FC<Props> = ({
  documentLine,
  hasInitialFocus = false,
  img,
  setSelectLine,
  active,
  asFrame,
  includeTopBorder,
  bookmarked,
  selected,
}) => {
  const [hasFocusOrHover, setHasFocusOrHover] = useState(hasInitialFocus)
  const [hasAvatarFocus, setHasAvatarFocus] = useState(false)
  const [modalData, setModalData] = useState<{
    title: string
    text: string
  } | null>(null)
  const [isModalVisible, setModalVisible] = useState(false)

  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const location = useLocation()
  const date = format(new Date(documentLine.publicationDate), dateFormat.is)
  const { id } = useParams<{
    id: string
  }>()
  const isUrgent = documentLine.isUrgent
  const {
    submitMailAction,
    loading: postLoading,
    bookmarkSuccess,
  } = useMailAction()

  const { fetchObject, refetch } = useDocumentList()

  const {
    setActiveDocument,
    setDocumentDisplayError,
    setDocLoading,
    setLocalRead,
    setReplyState,
    categoriesAvailable,
    localRead,
  } = useDocumentContext()

  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  }

  const wrapperRef = useRef(null)
  const avatarRef = useRef(null)

  const isFocused = useIsChildFocusedorHovered(wrapperRef)
  const isAvatarFocused = useIsChildFocusedorHovered(avatarRef, false)

  useEffect(() => {
    setHasFocusOrHover(isFocused)
  }, [isFocused])

  useEffect(() => {
    setHasAvatarFocus(isAvatarFocused)
  }, [isAvatarFocused])

  const displayErrorMessage = () => {
    const errorMessage = formatMessage(messages.documentFetchError, {
      senderName: documentLine.sender?.name ?? '',
    })
    if (asFrame) {
      toast.error(errorMessage, { toastId: 'overview-doc-error' })
    } else {
      setDocumentDisplayError(errorMessage)
    }
  }

  const displayPdf = (
    content?: DocumentV2Content,
    actions?: Array<DocumentV2Action>,
    alertMessageData?: DocumentV2Action,
  ) => {
    setActiveDocument({
      document: {
        type: content?.type,
        value: content?.value,
      },
      id: documentLine.id,
      sender: documentLine.sender?.name ?? '',
      subject: documentLine.subject,
      senderNatReg: documentLine.sender?.id ?? '',
      downloadUrl: documentLine.downloadUrl ?? '',
      date: date,
      img,
      categoryId: documentLine.categoryId ?? undefined,
      actions: actions,
      alert: alertMessageData ?? undefined,
    })
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  const [confirmAction] = useDocumentConfirmActionsLazyQuery({
    fetchPolicy: 'no-cache',
  })

  const [getDocument, { loading: fileLoading }] =
    useGetDocumentInboxLineV3LazyQuery({
      variables: {
        input: {
          id: documentLine.id,
          provider: documentLine.sender?.name ?? 'unknown',
          category: categoriesAvailable.find(
            (i) => i.id === documentLine?.categoryId,
          )?.name,
        },
        locale: lang,
      },
      fetchPolicy: 'no-cache',
      onCompleted: (data) => {
        if (asFrame) {
          navigate(
            DocumentsPaths.ElectronicDocumentSingle.replace(
              ':id',
              documentLine.id,
            ),
          )
        } else {
          const docContent = data?.documentV2?.content
          const actions = data?.documentV2?.actions ?? undefined
          const alert = data?.documentV2?.alert ?? undefined
          if (docContent) {
            displayPdf(docContent, actions, alert)
            setDocumentDisplayError(undefined)
            setLocalRead([...localRead, documentLine.id])
            const replyable = data?.documentV2?.replyable ?? false

            const ticket = data?.documentV2?.ticket
            if (ticket) {
              const reply: Reply = {
                ...ticket,
                comments: (ticket.comments ?? []).map((c) => ({
                  ...c,
                  hide: false,
                })),
              }
              setReplyState((prev) => ({
                ...prev,
                replies: reply,
                replyable,
                closedForMoreReplies:
                  data.documentV2?.closedForMoreReplies ?? false,
                replyOpen: prev?.replyOpen ?? false,
              }))
            }
          } else {
            setDocumentDisplayError(formatMessage(messages.documentErrorLoad))
          }
        }
      },
      onError: () => {
        displayErrorMessage()
      },
    })

  const [getDocumentMetadata, { loading: metadataLoading }] =
    useGetDocumentInboxLineV3LazyQuery({
      variables: {
        input: {
          id: documentLine.id,
          provider: documentLine.sender?.name ?? 'unknown',
          includeDocument: false,
          category: categoriesAvailable.find(
            (i) => i.id === documentLine?.categoryId,
          )?.name,
        },
      },

      fetchPolicy: 'no-cache',
      onCompleted: (data) => {
        const actions: DocumentV2Action | undefined | null =
          data?.documentV2?.confirmation

        setDocumentDisplayError(undefined)
        if (actions) {
          setModalData({
            title: actions.title ?? '',
            text: actions.data ?? '',
          })
          setModalVisible(true)
        } else {
          getDocument()
        }
      },
      onError: () => {
        displayErrorMessage()
      },
    })

  useEffect(() => {
    if (id === documentLine.id) {
      // If the document is marked as urgent, the user needs to acknowledge the document before opening it.
      if (isUrgent) {
        getDocumentMetadata()
      } else {
        getDocument()
      }
    }
  }, [id, documentLine, getDocument])

  useEffect(() => {
    setDocLoading(fileLoading)
  }, [fileLoading, setDocLoading])

  // If document is marked as urgent, the user needs to acknowledge the document before opening it
  // This is done by calling "getDocument" with "includeDocument=false" and receive the metadata about the document
  // This metadata includes actions array that should include an action with type 'confirmation' (also title and data),
  // which will be used to display a confirmation modal to the user
  const onLineClick = async () => {
    const pathName = location.pathname
    const match = matchPath(
      {
        path: DocumentsPaths.ElectronicDocumentSingle,
      },
      pathName,
    )

    if (match?.params?.id && match?.params?.id !== documentLine?.id) {
      navigate(DocumentsPaths.ElectronicDocumentsRoot, { replace: true })
    }
    if (isUrgent) {
      getDocumentMetadata()
    } else {
      getDocument()
    }
  }

  const confirmActionCaller = (confirmed: boolean | null) => {
    confirmAction({
      variables: {
        input: { id: documentLine.id, confirmed: confirmed },
      },
    })
  }
  const unread = !documentLine.opened && !localRead.includes(documentLine.id)
  const isBookmarked = bookmarked || bookmarkSuccess
  return (
    <Box className={styles.wrapper} ref={wrapperRef}>
      <Box
        display="flex"
        position="relative"
        borderColor="blue200"
        borderBottomWidth="standard"
        borderTopWidth={includeTopBorder ? 'standard' : undefined}
        paddingX={2}
        paddingTop="p2"
        paddingBottom={isUrgent ? 'p1' : 'p2'}
        width="full"
        className={cn(styles.docline, {
          [styles.active]: active,
          [styles.unread]: unread,
        })}
      >
        <div ref={avatarRef} className={styles.avatar}>
          <AvatarImage
            img={img}
            onClick={(e) => {
              e.stopPropagation()
              if (documentLine.id && setSelectLine && !isUrgent) {
                setSelectLine(documentLine.id)
              }
            }}
            avatar={
              (hasAvatarFocus || selected) && !asFrame && !isUrgent ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  background={selected ? 'blue400' : 'blue300'}
                  borderRadius="full"
                  className={styles.checkCircle}
                >
                  <Icon icon="checkmark" color="white" type="filled" />
                </Box>
              ) : undefined
            }
            background={
              hasAvatarFocus && !isUrgent
                ? asFrame
                  ? 'white'
                  : 'blue200'
                : documentLine.opened
                ? 'blue100'
                : 'white'
            }
          />
        </div>
        <Box
          width="full"
          display="flex"
          flexDirection="column"
          paddingLeft={2}
          minWidth={0}
        >
          {active && <div className={styles.fakeBorder} />}
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="spaceBetween"
            overflow="hidden"
            alignItems="center"
          >
            <Box
              display="inlineFlex"
              alignItems="center"
              minWidth={0}
              flexShrink={1}
              overflow="hidden"
            >
              <Text variant="medium" truncate>
                {documentLine.sender?.name ?? ''}
              </Text>
              {documentLine.replyable && (
                <Box
                  paddingX="smallGutter"
                  marginLeft="smallGutter"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexShrink={0}
                >
                  <Icon
                    icon="undo"
                    color="dark400"
                    size="small"
                    type="outline"
                  />
                </Box>
              )}
            </Box>
            <Box flexShrink={0} marginLeft={2}>
              <Text variant="medium">{date}</Text>
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
            <button
              onClick={async () => onLineClick()}
              aria-label={formatMessage(m.openDocumentAriaLabel, {
                subject: documentLine.subject,
              })}
              type="button"
              id={`button-${documentLine.id}`}
              className={styles.docLineButton}
            >
              <Text
                fontWeight={unread ? 'medium' : 'regular'}
                color="blue400"
                truncate
              >
                {documentLine.subject}
              </Text>
            </button>

            <Box display="flex" alignItems="center">
              {(postLoading || fileLoading || metadataLoading) && (
                <Box display="flex" alignItems="center">
                  <LoadingDots single />
                </Box>
              )}
              {(hasFocusOrHover || isBookmarked) &&
                !postLoading &&
                !fileLoading &&
                !asFrame && (
                  <FavAndStash
                    bookmarked={isBookmarked}
                    onFav={
                      isBookmarked || hasFocusOrHover
                        ? async (e) => {
                            e.stopPropagation()
                            await submitMailAction(
                              isBookmarked ? 'unbookmark' : 'bookmark',
                              documentLine.id,
                            )
                            refetch(fetchObject)
                          }
                        : undefined
                    }
                  />
                )}
              {isUrgent && <UrgentTag />}
            </Box>
          </Box>
        </Box>
      </Box>
      {isModalVisible && (
        <ConfirmationModal
          onSubmit={() => {
            setModalVisible(false)
            confirmActionCaller(true)
            getDocument()
          }}
          onCancel={() => {
            setModalVisible(false)
            confirmActionCaller(false)
          }}
          onClose={() => {
            toggleModal()
            confirmActionCaller(null)
          }}
          loading={false}
          modalTitle={modalData?.title || formatMessage(m.acknowledgeTitle)}
          modalText={
            modalData?.text ||
            formatMessage(m.acknowledgeText, {
              arg: documentLine.sender.name,
            })
          }
          redirectPath={''}
        />
      )}
    </Box>
  )
}

export default DocumentLine
