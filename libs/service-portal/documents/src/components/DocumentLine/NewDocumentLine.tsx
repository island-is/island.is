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
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { dateFormat } from '@island.is/shared/constants'
import { ActionCard, LoadModal } from '@island.is/service-portal/core'
import * as styles from './DocumentLine.css'
import { gql, useLazyQuery } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { messages as m } from '../../utils/messages'

interface Props {
  documentLine: Document
  img?: string
  documentCategories?: DocumentCategory[]
  userInfo?: User
  onClick: (document: DocumentDetails) => void
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
}) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.sm
  const { formatMessage } = useLocale()

  const [getDocument, { data: getFileByIdData, loading, error }] = useLazyQuery(
    GET_DOCUMENT_BY_ID,
    {
      variables: {
        input: {
          id: documentLine.id,
        },
      },
      onCompleted: () => {
        //onClickHandler()
        onClick(singleDocument)
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      },
    },
  )

  const singleDocument = getFileByIdData?.getDocument || ({} as DocumentDetails)

  const onClickHandler = async () => {
    let html: string | undefined = undefined
    if (singleDocument.html) {
      html = singleDocument.html.length > 0 ? singleDocument.html : undefined
    }
    if (html) {
      setTimeout(() => {
        const win = window.open('', '_blank')
        win && html && win.document.write(html)
        win?.focus()
      }, 250)
    } else {
      // Create form elements
      const form = document.createElement('form')
      const documentIdInput = document.createElement('input')
      const tokenInput = document.createElement('input')

      const token = userInfo?.access_token

      if (!token) return

      form.appendChild(documentIdInput)
      form.appendChild(tokenInput)

      // Form values
      form.method = 'post'
      // TODO: Use correct url
      form.action = documentLine.url
      form.target = '_blank'

      // Document Id values
      documentIdInput.type = 'hidden'
      documentIdInput.name = 'documentId'
      documentIdInput.value = documentLine.id

      // National Id values
      tokenInput.type = 'hidden'
      tokenInput.name = '__accessToken'
      tokenInput.value = token

      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
    }
  }

  const date = (variant: 'small' | 'medium') => (
    <Text variant={variant}>
      {format(new Date(documentLine.date), dateFormat.is)}
    </Text>
  )

  const image = img && <img className={styles.image} src={img} alt="" />
  const isLink = documentLine.fileType === 'url' && documentLine.url

  const subject = isLink ? (
    <Link href={documentLine.url} newTab>
      <button className={styles.button}>
        {documentLine.subject}
        <Icon type="outline" icon="open" size="small" className={styles.icon} />
      </button>
    </Link>
  ) : (
    <button
      className={cn(styles.button, {
        [styles.unopened]: !documentLine.opened,
      })}
      // Check if data is already fetched, if so go straight to download/display
      onClick={async () => {
        if (getFileByIdData && !loading) {
          onClickHandler()
        } else {
          getDocument({ variables: { input: { id: documentLine.id } } })
        }
      }}
    >
      {documentLine.subject}
    </button>
  )

  const group = (variant: 'eyebrow' | 'medium') => {
    const categoryGroup = documentCategories?.find(
      (item) => item.id === documentLine.categoryId,
    )
    return (
      <Text variant={variant} id="groupName">
        {categoryGroup?.name || ''}
      </Text>
    )
  }

  const sender = (variant: 'eyebrow' | 'medium') => (
    <Text variant={variant} id="senderName">
      {documentLine.senderName}
    </Text>
  )

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

  const content = () => (
    <Box display="flex">
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
      <Box display="flex" flexDirection="column" width="full" paddingLeft={3}>
        <Text fontWeight="medium" paddingBottom={1}>
          {documentLine.subject}
        </Text>

        <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
          <Text variant="medium">{documentLine.senderName}</Text>
          <Text variant="medium">
            {format(new Date(documentLine.date), dateFormat.is)}
          </Text>
        </Box>
      </Box>
    </Box>
  )

  return (
    <>
      {loading && <LoadModal />}

      <FocusableBox
        display="flex"
        borderRadius="standard"
        border="standard"
        borderColor="blue200"
        paddingX={4}
        paddingY={3}
        href={isLink ? documentLine.url : undefined}
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
          <Text fontWeight="medium" paddingBottom={1}>
            {documentLine.subject}
          </Text>

          <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
            <Text variant="medium">{documentLine.senderName}</Text>
            <Text variant="medium">
              {format(new Date(documentLine.date), dateFormat.is)}
            </Text>
          </Box>
        </Box>
      </FocusableBox>
    </>
  )
}

export default NewDocumentLine
