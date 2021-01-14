import React, { FC, useState } from 'react'
import { Modal } from '@island.is/service-portal/core'
import { Document, DocumentDetails } from '@island.is/api/schema'
import { GET_DOCUMENT, client } from '@island.is/service-portal/graphql'
import { useLocale } from '@island.is/localization'
import * as styles from './DocumentLine.treat'
import {
  toast,
  Text,
  Stack,
  Button,
  Box,
  GridRow,
  GridColumn,
  Link,
  Hidden,
} from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'
import { documentsOpenDocument } from '@island.is/plausible'
import * as Sentry from '@sentry/react'
import format from 'date-fns/format'

const base64ToArrayBuffer = (base64Pdf: string) => {
  const binaryString = window.atob(base64Pdf)
  const binaryLen = binaryString.length
  const bytes = new Uint8Array(binaryLen)
  for (let i = 0; i < binaryLen; i++) {
    const ascii = binaryString.charCodeAt(i)
    bytes[i] = ascii
  }
  return bytes
}

const getPdfURL = (base64Pdf: string) => {
  const byte = base64ToArrayBuffer(base64Pdf)
  const blob = new Blob([byte], { type: 'application/pdf' })
  return URL.createObjectURL(blob)
}

const documentIsPdf = (data: DocumentDetails) => {
  return (data?.fileType || '').toLowerCase() === 'pdf' && data?.content
}

const getEdgecaseDocument = (
  document: Document,
): DocumentDetails | undefined => {
  const { url, fileType } = document
  return fileType === 'url' && url
    ? { fileType, url, content: '', html: '' }
    : undefined
}

interface Props {
  document: Document
}

const DocumentLine: FC<Props> = ({ document }) => {
  const { formatMessage } = useLocale()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { pathname } = useLocation()
  const [{ loading, documentDetails }, setDocumentDetails] = useState<{
    loading?: boolean
    documentDetails?: DocumentDetails
  }>({})

  const displayErrorToast = () => {
    toast.error(
      formatMessage({
        id: 'sp.documents:documentCard-error-singleDocument',
        defaultMessage: 'Ekki tókst að sækja skjal',
      }),
    )
  }

  const displayDocument = (doc: DocumentDetails) => {
    if (documentIsPdf(doc)) {
      window.open(getPdfURL(doc.content))
      return
    }
    Sentry.captureMessage('Unsupported document', Sentry.Severity.Error)

    setIsModalOpen(true)
  }

  const fetchDocument = async () => {
    setDocumentDetails({ loading: true })
    Sentry.addBreadcrumb({
      category: 'Document',
      type: 'Document-Info',
      message: `Fetching single document`,
      data: {
        id: document.id,
        fileType: document.fileType,
        subject: document.subject,
        senderName: document.senderName,
      },
      level: Sentry.Severity.Info,
    })
    // Note: opening window before fetching data, to prevent popup-blocker
    const windowRef = window.open()
    try {
      const { data } = await client.query({
        query: GET_DOCUMENT,
        variables: { input: { id: document.id } },
      })
      const doc = data?.getDocument
      if (!doc) {
        throw new Error('DocumentDetails is empty')
      }

      Sentry.addBreadcrumb({
        category: 'Document',
        type: 'Document-Info',
        message: `DocumentDetails received`,
        data: {
          id: document.id,
          fileType: doc.fileType,
          includesBase64Content: (!!doc.content).toString(),
          includesHtml: (!!doc.html).toString(),
          includesUrl: (!!doc.url).toString(),
        },
        level: Sentry.Severity.Info,
      })
      setDocumentDetails({ documentDetails: doc })
      documentsOpenDocument(pathname, document.subject)
      if (documentIsPdf(doc) && windowRef) {
        windowRef.location.assign(getPdfURL(doc.content))
        return
      }
      windowRef && windowRef.close()
      window.focus()
      window.setTimeout(() => displayDocument(doc), 100)
    } catch (error) {
      setDocumentDetails({})
      windowRef && windowRef.close()
      window.focus()
      window.setTimeout(displayErrorToast, 100)
      Sentry.captureException(error)
    }
  }

  const onClickHandler = () => {
    if (loading) return
    documentDetails ? displayDocument(documentDetails) : fetchDocument()
  }

  const handleOnModalClose = () => {
    setIsModalOpen(false)
  }

  const externalUrl = getEdgecaseDocument(document)?.url

  return (
    <>
      <Box className={styles.line} paddingY={2}>
        <GridRow>
          <GridColumn span={['1/1', '2/12']}>
            <Box
              className={styles.date}
              display="flex"
              alignItems="center"
              height="full"
              paddingX={2}
            >
              {format(new Date(document.date), 'dd.MM.yyyy')}
            </Box>
          </GridColumn>
          <GridColumn span={['1/1', '7/12']}>
            <Box
              display="flex"
              alignItems="center"
              height="full"
              paddingX={2}
              paddingBottom={[1, 0]}
            >
              {externalUrl ? (
                <Link href={externalUrl}>
                  <button className={styles.button}>{document.subject}</button>
                </Link>
              ) : (
                <button className={styles.button} onClick={onClickHandler}>
                  {document.subject}
                </button>
              )}
            </Box>
          </GridColumn>
          <GridColumn span={['1/1', '3/12']}>
            <Box
              className={styles.sender}
              display="flex"
              alignItems="center"
              height="full"
              paddingX={2}
            >
              {document.senderName}
            </Box>
          </GridColumn>
        </GridRow>
      </Box>
      {isModalOpen && (
        <>
          <Modal
            id={`documentModal_${new Date().getMilliseconds()}`}
            onCloseModal={handleOnModalClose}
          >
            <Stack space={2}>
              <Text variant="h1">
                {formatMessage({
                  id: 'sp.documents:document-notSupported-title',
                  defaultMessage: 'Ekki stuðningur við þetta skjal',
                })}
              </Text>
              <Text>
                {formatMessage({
                  id: 'sp.documents:document-notSupported-description',
                  defaultMessage:
                    'Því miður bjóða mínar síður ekki upp á stuðning við þetta skjal eins og er. Þú getur farið á vef viðkomandi stofnunar til þess að skoða skjalið.',
                })}
              </Text>
            </Stack>
            <Box marginTop={5} className={styles.modalButtonWrapper}>
              <Button fluid variant="primary" onClick={handleOnModalClose}>
                {formatMessage({
                  id: 'sp.documents:document-notSupported-closeModalBtnText',
                  defaultMessage: 'Loka glugga',
                })}
              </Button>
            </Box>
          </Modal>
        </>
      )}
    </>
  )
}

export default DocumentLine
