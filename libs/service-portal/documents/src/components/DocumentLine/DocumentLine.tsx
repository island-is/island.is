import cn from 'classnames'
import format from 'date-fns/format'
import React, { FC } from 'react'
import { useWindowSize } from 'react-use'

import {
  Document,
  DocumentCategory,
  DocumentDetails,
  Query,
  QueryGetDocumentArgs,
} from '@island.is/api/schema'
import { User } from '@island.is/shared/types'
import {
  Box,
  GridColumn,
  GridRow,
  Link,
  Text,
  Icon,
  AlertBanner,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { dateFormat } from '@island.is/shared/constants'
import {
  LoadModal,
  formatPlausiblePathToParams,
} from '@island.is/service-portal/core'
import * as styles from './DocumentLine.css'
import { gql, useLazyQuery } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { messages as m } from '../../utils/messages'
import { servicePortalOutboundLink } from '@island.is/plausible'
import { DocumentsPaths } from '../../lib/paths'

interface Props {
  documentLine: Document
  img?: string
  documentCategories?: DocumentCategory[]
  userInfo?: User
}

const GET_DOCUMENT_BY_ID = gql`
  query getDocumentInboxLineQuery($input: GetDocumentInput!) {
    getDocument(input: $input) {
      html
      url
    }
  }
`
const DocumentLine: FC<React.PropsWithChildren<Props>> = ({
  documentLine,
  img,
  documentCategories,
  userInfo,
}) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.sm
  const { formatMessage } = useLocale()

  const [getDocument, { data: getFileByIdData, loading, error }] = useLazyQuery<
    Query,
    QueryGetDocumentArgs
  >(GET_DOCUMENT_BY_ID, {
    variables: {
      input: {
        id: documentLine.id,
      },
    },
    onCompleted: (data: { getDocument?: DocumentDetails | null }) => {
      if (data?.getDocument) {
        onClickHandler(data?.getDocument)
      }
    },
  })

  const singleDocument = getFileByIdData?.getDocument || ({} as DocumentDetails)

  const onClickHandler = async (docData?: DocumentDetails) => {
    const singleDocData = docData || singleDocument
    let html: string | undefined = undefined
    if (singleDocData.html) {
      html = singleDocData.html.length > 0 ? singleDocData.html : undefined
    }
    if (singleDocData.url) {
      window.open(singleDocData.url, '_blank')?.focus()
      return
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
    <Link
      onClick={() =>
        servicePortalOutboundLink({
          url: formatPlausiblePathToParams(
            DocumentsPaths.ElectronicDocumentsRoot,
          ).url,
          outboundUrl: documentLine.url,
        })
      }
      href={documentLine.url}
      newTab
    >
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

  return (
    <>
      {loading && <LoadModal />}
      <Box
        position="relative"
        className={cn(styles.line, {
          [styles.unopenedWrapper]: !documentLine.opened && !isLink,
          [styles.linkWrapper]: isLink,
        })}
        paddingY={2}
      >
        {isMobile ? (
          <GridRow alignItems="flexStart" align="flexStart">
            {img && (
              <GridColumn span="2/12">
                <Box
                  display="flex"
                  alignItems="center"
                  height="full"
                  paddingX={[0, 2]}
                  paddingBottom={[1, 0]}
                >
                  {image}
                </Box>
              </GridColumn>
            )}
            <GridColumn span="7/12">
              <Box
                display="flex"
                alignItems="center"
                paddingX={[0, 2]}
                className={styles.sender}
              >
                {sender('eyebrow')}
              </Box>
              <Box display="flex" alignItems="center" paddingX={[0, 2]}>
                {subject}
              </Box>
            </GridColumn>
            <GridColumn span="3/12">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flexEnd"
                height="full"
                paddingX={[0, 2]}
              >
                {date('small')}
              </Box>
            </GridColumn>
          </GridRow>
        ) : (
          <GridRow>
            <GridColumn span={['1/1', '2/12']}>
              <Box
                display="flex"
                alignItems="center"
                height="full"
                paddingX={[0, 2]}
              >
                {date('medium')}
              </Box>
            </GridColumn>
            <GridColumn span={['1/1', '4/12']}>
              <Box
                display="flex"
                alignItems="center"
                height="full"
                paddingX={[0, 2]}
                paddingBottom={[1, 0]}
              >
                {img && image}
                {subject}
              </Box>
            </GridColumn>
            <GridColumn span={['1/1', '3/12']}>
              <Box
                display="flex"
                alignItems="center"
                height="full"
                paddingX={[0, 2]}
                className={styles.sender}
              >
                {group('medium')}
              </Box>
            </GridColumn>
            <GridColumn span={['1/1', '3/12']}>
              <Box
                display="flex"
                alignItems="center"
                height="full"
                paddingX={[0, 2]}
                className={styles.sender}
              >
                {sender('medium')}
              </Box>
            </GridColumn>
          </GridRow>
        )}
        {error && displayError()}
      </Box>
    </>
  )
}

export default DocumentLine
