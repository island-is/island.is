import cn from 'classnames'
import format from 'date-fns/format'
import { FC, useEffect, useRef, useState } from 'react'

import {
  Document,
  DocumentDetails,
  GetDocumentListInput,
} from '@island.is/api/schema'
import { Box, Text, LoadingDots, Icon } from '@island.is/island-ui/core'
import { dateFormat } from '@island.is/shared/constants'
import { m } from '@island.is/service-portal/core'
import * as styles from './DocumentLine.css'
import { gql, useLazyQuery } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { messages } from '../../utils/messages'
import AvatarImage from './AvatarImage'
import { useNavigate } from 'react-router-dom'
import { DocumentsPaths } from '../../lib/paths'
import { FavAndStash } from '../FavAndStash'
import { useSubmitMailAction } from '../../utils/useSubmitMailAction'
import { useIsChildFocusedorHovered } from '../../hooks/useIsChildFocused'
import { ActiveDocumentType } from '../../lib/types'

interface Props {
  documentLine: Document
  img?: string
  onClick?: (doc: ActiveDocumentType) => void
  onError?: (error?: string) => void
  onLoading?: (loading: boolean) => void
  setSelectLine?: (id: string) => void
  refetchInboxItems?: (input?: GetDocumentListInput) => void
  active: boolean
  asFrame?: boolean
  selected?: boolean
  bookmarked?: boolean
  archived?: boolean
}

const GET_DOCUMENT_BY_ID = gql`
  query getDocumentInboxLineQuery($input: GetDocumentInput!) {
    getDocument(input: $input) {
      html
      content
      url
    }
  }
`
export const DocumentLine: FC<Props> = ({
  documentLine,
  img,
  onClick,
  onError,
  onLoading,
  setSelectLine,
  refetchInboxItems,
  active,
  asFrame,
  bookmarked,
  archived,
  selected,
}) => {
  const [avatarCheckmark, setAvatarCheckmark] = useState(false)
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const date = format(new Date(documentLine.date), dateFormat.is)

  const {
    submitMailAction,
    archiveSuccess,
    bookmarkSuccess,
    loading: postLoading,
  } = useSubmitMailAction({ messageId: documentLine.id })

  const wrapperRef = useRef(null)

  const isFocused = useIsChildFocusedorHovered(wrapperRef)

  useEffect(() => {
    setAvatarCheckmark(isFocused)
  }, [isFocused])

  const displayPdf = (docContent?: DocumentDetails) => {
    if (onClick) {
      onClick({
        document:
          docContent || (getFileByIdData?.getDocument as DocumentDetails),
        id: documentLine.id,
        subject: documentLine.subject,
        sender: documentLine.senderName,
        downloadUrl: documentLine.url,
        date: date,
        img,
        categoryId: documentLine.categoryId ?? undefined,
      })
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  const [getDocument, { data: getFileByIdData, loading: fileLoading }] =
    useLazyQuery(GET_DOCUMENT_BY_ID, {
      variables: {
        input: {
          id: documentLine.id,
        },
      },
      fetchPolicy: 'no-cache',
      onCompleted: (data) => {
        const docContent = data?.getDocument
        if (asFrame) {
          navigate(DocumentsPaths.ElectronicDocumentsRoot, {
            state: {
              id: documentLine.id,
              doc: {
                document: docContent as DocumentDetails,
                id: documentLine.id,
                subject: documentLine.subject,
                sender: documentLine.senderName,
                downloadUrl: documentLine.url,
                date: date,
                img,
              },
            },
          })
        } else {
          displayPdf(docContent)
          if (onError) {
            onError(undefined)
          }
        }
      },
      onError: () => {
        if (onError) {
          onError(
            formatMessage(messages.documentFetchError, {
              senderName: documentLine.senderName,
            }),
          )
        }
      },
    })

  useEffect(() => {
    if (onLoading) {
      onLoading(fileLoading)
    }
  }, [fileLoading])

  const onLineClick = async () => {
    getFileByIdData
      ? displayPdf()
      : await getDocument({
          variables: { input: { id: documentLine.id } },
        })
  }

  const unread = !documentLine.opened
  const isBookmarked = bookmarked || bookmarkSuccess
  const isArchived = archived || archiveSuccess

  return (
    <Box className={styles.wrapper} ref={wrapperRef}>
      <Box
        display="flex"
        position="relative"
        borderColor="blue200"
        borderBottomWidth="standard"
        paddingX={2}
        width="full"
        className={cn(styles.docline, {
          [styles.active]: active,
          [styles.unread]: unread,
        })}
      >
        <AvatarImage
          img={img}
          onClick={(e) => {
            e.stopPropagation()
            if (documentLine.id && setSelectLine) {
              setSelectLine(documentLine.id)
            }
          }}
          avatar={
            (avatarCheckmark || selected) && !asFrame ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                background={selected ? 'blue400' : 'blue300'}
                borderRadius="circle"
                className={styles.checkCircle}
              >
                <Icon icon="checkmark" color="white" type="filled" />
              </Box>
            ) : undefined
          }
          background={
            avatarCheckmark
              ? asFrame
                ? 'white'
                : 'blue200'
              : documentLine.opened
              ? 'blue100'
              : 'white'
          }
        />
        <Box
          width="full"
          display="flex"
          flexDirection="column"
          paddingLeft={2}
          minWidth={0}
        >
          {active && <div className={styles.fakeBorder} />}
          <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
            <Text variant="small" truncate>
              {documentLine.senderName}
            </Text>
            <Text variant="small">{date}</Text>
          </Box>
          <Box
            className={styles.title}
            display="flex"
            flexDirection="row"
            justifyContent="spaceBetween"
          >
            <button
              onClick={async () => onLineClick()}
              aria-label={formatMessage(m.openDocumentAriaLabel, {
                subject: documentLine.subject,
              })}
              type="button"
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
            {(avatarCheckmark || isBookmarked || isArchived) &&
              !postLoading &&
              !asFrame && (
                <FavAndStash
                  bookmarked={isBookmarked}
                  archived={isArchived}
                  onFav={
                    avatarCheckmark || isBookmarked
                      ? async (e) => {
                          e.stopPropagation()
                          await submitMailAction(
                            isBookmarked ? 'unbookmark' : 'bookmark',
                          )
                          if (refetchInboxItems) {
                            refetchInboxItems()
                          }
                        }
                      : undefined
                  }
                  onStash={
                    avatarCheckmark || isArchived
                      ? async (e) => {
                          e.stopPropagation()
                          await submitMailAction(
                            isArchived ? 'unarchive' : 'archive',
                          )
                          if (refetchInboxItems) {
                            refetchInboxItems()
                          }
                        }
                      : undefined
                  }
                />
              )}
            {postLoading && (
              <Box display="flex" alignItems="center">
                <LoadingDots single />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default DocumentLine
