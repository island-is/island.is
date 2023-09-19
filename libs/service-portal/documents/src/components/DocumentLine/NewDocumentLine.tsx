import cn from 'classnames'
import format from 'date-fns/format'
import React, { FC, useState } from 'react'
import { useWindowSize } from 'react-use'

import {
  Document,
  DocumentCategory,
  DocumentDetails,
} from '@island.is/api/schema'
import { User } from '@island.is/shared/types'
import {
  Box,
  Link,
  Text,
  Icon,
  AlertBanner,
  FocusableBox,
  Button,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { dateFormat } from '@island.is/shared/constants'
import {
  ActionCard,
  CardLoader,
  LoadModal,
} from '@island.is/service-portal/core'
import * as styles from './NewDocumentLine.css'
import { gql, useLazyQuery } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { messages as m } from '../../utils/messages'
import { ActiveDocumentType } from '../../screens/Overview/NewOverview'
import AvatarImage from './AvatarImage'
import { useNavigate } from 'react-router-dom'
import { DocumentsPaths } from '../../lib/paths'

interface Props {
  documentLine: Document
  img?: string
  onClick?: (doc: ActiveDocumentType) => void
  setSelectLine?: (id: string) => void
  active: boolean
  loading?: boolean
  asFrame?: boolean
  selected?: boolean
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
export const NewDocumentLine: FC<Props> = ({
  documentLine,
  img,
  onClick,
  setSelectLine,
  active,
  loading,
  asFrame,
  selected,
}) => {
  const { width } = useWindowSize()
  const [avatarCheckmark, setAvatarCheckmark] = useState(false)
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const date = format(new Date(documentLine.date), dateFormat.is)

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

  const [
    getDocument,
    { data: getFileByIdData, loading: fileLoading, error, refetch, called },
  ] = useLazyQuery(GET_DOCUMENT_BY_ID, {
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
      }
    },
  })

  const isLink = documentLine.fileType === 'url' && documentLine.url

  const displayError = () => {
    return (
      <Box paddingTop={2}>
        <AlertBanner
          variant="error"
          description={formatMessage(m.documentFetchError, {
            senderName: documentLine.senderName,
          })}
        />
      </Box>
    )
  }

  const onLineClick = async () => {
    getFileByIdData
      ? displayPdf()
      : await getDocument({
          variables: { input: { id: documentLine.id } },
        })
  }

  if (loading) {
    return <CardLoader />
  }

  const unread = !documentLine.opened

  return (
    <>
      {fileLoading && <LoadModal />}

      <button
        className={styles.wrapper}
        onClick={!isLink ? async () => onLineClick() : undefined}
      >
        <Box
          display="flex"
          position="relative"
          borderColor="blue200"
          borderBottomWidth="standard"
          paddingX={2}
          width="full"
          href={isLink ? documentLine.url : undefined}
          className={cn(styles.docline, {
            [styles.active]: active,
            [styles.unread]: unread,
          })}
          onMouseEnter={asFrame ? undefined : () => setAvatarCheckmark(true)}
          onMouseLeave={asFrame ? undefined : () => setAvatarCheckmark(false)}
        >
          <AvatarImage
            img={img}
            onClick={(e) => {
              e.stopPropagation()
              if (documentLine.id && setSelectLine) {
                setSelectLine(documentLine.id)
              }
              console.log('ON AVATAR CLICK')
            }}
            avatar={
              avatarCheckmark || selected ? (
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
              avatarCheckmark || selected
                ? 'blue200'
                : documentLine.opened
                ? 'blue100'
                : 'white'
            }
          />
          <Box
            width="full"
            display="flex"
            flexDirection="column"
            paddingLeft={3}
            minWidth={0}
          >
            {active && <div className={styles.fakeBorder} />}
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="spaceBetween"
            >
              <Text variant="small">{documentLine.senderName}</Text>
              <Text variant="small">{date}</Text>
            </Box>
            <Box
              // className={styles.title}
              width="full"
              textAlign="left"
              position="relative"
            >
              <Text
                fontWeight={unread ? 'semiBold' : 'regular'}
                color="blue400"
                truncate
              >
                {documentLine.subject}
                {/* {unread && (
                <Box borderRadius="circle" className={cn(styles.badge)}></Box>
              )} */}
              </Text>
            </Box>
          </Box>
        </Box>
      </button>
      {error && displayError()}
    </>
  )
}

export default NewDocumentLine
