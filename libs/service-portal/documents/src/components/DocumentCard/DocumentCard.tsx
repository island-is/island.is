import React, { FC, useState } from 'react'
import { useApolloClient } from '@apollo/client/react'
import {
  ActionCard,
  formatPlausiblePathToParams,
  Modal,
} from '@island.is/service-portal/core'
import { Document, DocumentDetails } from '@island.is/api/schema'
import { GET_DOCUMENT } from '@island.is/service-portal/graphql'
import { useLocale } from '@island.is/localization'
import * as styles from './DocumentCard.css'
import { toast, Text, Stack, Button, Box } from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'
import { documentsOpenDocument } from '@island.is/plausible'

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

const DocumentCard: FC<React.PropsWithChildren<Props>> = ({ document }) => {
  const client = useApolloClient()
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
    console.error('Unsupported document')

    setIsModalOpen(true)
  }

  const fetchDocument = async () => {
    setDocumentDetails({ loading: true })

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

      setDocumentDetails({ documentDetails: doc })
      documentsOpenDocument(
        formatPlausiblePathToParams(pathname, document.subject),
      )
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
      console.error(error)
    }
  }

  const onClickHandler = () => {
    if (loading) return
    documentDetails ? displayDocument(documentDetails) : fetchDocument()
  }

  const handleOnModalClose = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <ActionCard
        heading={document.subject}
        date={new Date(document.date).toLocaleDateString()}
        eyebrow={document.senderName}
        key={document.id}
        cta={{
          url: getEdgecaseDocument(document)?.url,
          onClick: onClickHandler,
          label: formatMessage({
            id: 'sp.documents:documentCard-ctaLabel',
            defaultMessage: 'Skoða skjal',
          }),
        }}
      />
      {isModalOpen && (
        <Modal
          id={`documentModal_${new Date().getMilliseconds()}`}
          onCloseModal={handleOnModalClose}
        >
          <Stack space={2}>
            <Text variant="h3" as="h1">
              {formatMessage({
                id: 'sp.documents:document-notSupported-title',
                defaultMessage: 'Ekki er hægt að sýna þetta skjal.',
              })}
            </Text>
            <Text>
              {formatMessage({
                id: 'sp.documents:document-notSupported-description',
                defaultMessage:
                  'Því miður er ekki hægt að skoða þetta skjal á Mínum síðum eins og er. Þú getur skoðað skjalið á vef viðkomandi stofnunar.',
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
      )}
    </>
  )
}

export default DocumentCard
