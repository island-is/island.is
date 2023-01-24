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
import * as styles from './DocumentLine.css'
import { gql, useLazyQuery } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { messages as m } from '../../utils/messages'
import { ActiveDocumentType } from '../../screens/Overview/NewOverview'

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

  const [
    getDocument,
    { data: getFileByIdData, loading: fileLoading, error },
  ] = useLazyQuery(GET_DOCUMENT_BY_ID, {
    variables: {
      input: {
        id: documentLine.id,
      },
    },
    onCompleted: () => {
      onClick({
        document: singleDocument,
        id: documentLine.id,
        subject: documentLine.subject,
        sender: documentLine.senderName,
        date: date,
        downloadUrl: documentLine.url,
      })
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  })

  const singleDocument = getFileByIdData?.getDocument || ({} as DocumentDetails)

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

  return (
    <>
      {fileLoading && <LoadModal />}

      <FocusableBox
        display="flex"
        borderRadius="standard"
        border={'standard'}
        borderColor={active ? 'blue400' : 'blue200'}
        paddingX={4}
        paddingY={3}
        href={isLink ? documentLine.url : undefined}
        className={cn(
          active && styles.active,
          !documentLine.opened && styles.unread,
        )}
        onClick={
          !isLink
            ? async () => {
                if (getFileByIdData && !loading) {
                  //onClickHandler()
                } else {
                  getDocument({ variables: { input: { id: documentLine.id } } })
                }
              }
            : undefined
        }
      >
        {!isMobile && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            background="blue100"
            borderRadius="circle"
            className={styles.imageContainer}
          >
            <img className={styles.image} src={img} alt="document" />
          </Box>
        )}
        <Box display="flex" flexDirection="column" width="full" paddingLeft={3}>
          <Box position="relative">
            <Text
              fontWeight="semiBold"
              paddingBottom={1}
              color={active ? 'blue400' : undefined}
            >
              {documentLine.subject}
              {!documentLine.opened && (
                <Box borderRadius="circle" className={cn(styles.badge)}></Box>
              )}
            </Text>
          </Box>
          <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
            <Text variant="medium">{documentLine.senderName}</Text>
            <Text variant="medium">{date}</Text>
          </Box>
        </Box>
      </FocusableBox>
      {error && displayError()}
    </>
  )
}

export default NewDocumentLine
