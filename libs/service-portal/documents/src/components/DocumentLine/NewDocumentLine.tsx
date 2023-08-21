import cn from 'classnames'
import format from 'date-fns/format'
import React, { FC } from 'react'
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

interface Props {
  documentLine: Document
  img?: string
  documentCategories?: DocumentCategory[]
  userInfo?: User
  onClick: (doc: ActiveDocumentType) => void
  active: boolean
  loading?: boolean
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
const NewDocumentLine: FC<Props> = ({
  documentLine,
  img,
  documentCategories,
  userInfo,
  onClick,
  active,
  loading,
}) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.sm
  const { formatMessage } = useLocale()
  const date = format(new Date(documentLine.date), dateFormat.is)

  const displayPdf = (docContent?: DocumentDetails) => {
    onClick({
      document: docContent || (getFileByIdData?.getDocument as DocumentDetails),
      id: documentLine.id,
      subject: documentLine.subject,
      sender: documentLine.senderName,
      downloadUrl: documentLine.url,
      date: date,
      img,
    })
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
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
      displayPdf(data?.getDocument)
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

  if (loading) {
    return <CardLoader />
  }

  const unread = !documentLine.opened

  return (
    <>
      {fileLoading && <LoadModal />}

      <button
        className={styles.wrapper}
        onClick={
          !isLink
            ? async () => {
                getFileByIdData
                  ? displayPdf()
                  : await getDocument({
                      variables: { input: { id: documentLine.id } },
                    })
              }
            : undefined
        }
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
        >
          {!isMobile && (
            <AvatarImage
              img={img}
              background={documentLine.opened ? 'blue100' : 'white'}
            />
          )}
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
