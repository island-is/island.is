import React, { FC, useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { Modal } from '@island.is/service-portal/core'
import { GET_DOCUMENT } from '@island.is/service-portal/graphql'
import { documentsOpenDocument } from '@island.is/plausible'
import * as styles from './Document.treat'
import * as Sentry from '@sentry/react'
import {
  DocumentDetails,
  QueryGetDocumentArgs,
  Query,
} from 'libs/api/schema/src'
import { useQuery } from '@apollo/client'
import {
  Text,
  Stack,
  Button,
  Box,
  LoadingIcon,
} from '@island.is/island-ui/core'
import { useLocale } from 'libs/localization/src'

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

export const Document: FC = () => {
  const { formatMessage } = useLocale()
  const { id } = useParams<{ id: string }>()
  const { pathname } = useLocation()
  const [isUnsupported, setIsUnsupported] = useState(false)
  const { data, called, error, loading } = useQuery<
    Query,
    QueryGetDocumentArgs
  >(GET_DOCUMENT, {
    variables: {
      input: { id },
    },
  })
  const doc = data?.getDocument

  // On mount events
  useEffect(() => {
    // Log document fetch to sentry
    Sentry.addBreadcrumb({
      category: 'Document',
      type: 'Document-Info',
      message: `Fetching single document`,
      data: {
        id,
      },
      level: Sentry.Severity.Info,
    })
  }, [])

  // On error events
  useEffect(() => {
    // Sentry: Error fetching document
    if (error)
      Sentry.captureMessage('Error fetching document', Sentry.Severity.Error)
  }, [error])

  // On success effect
  useEffect(() => {
    if (called && !loading && !error && doc) {
      // Sentry: Details received
      Sentry.addBreadcrumb({
        category: 'Document',
        type: 'Document-Info',
        message: `DocumentDetails received`,
        data: {
          id,
          fileType: doc.fileType,
          includesBase64Content: (!!doc.content).toString(),
          includesHtml: (!!doc.html).toString(),
          includesUrl: (!!doc.url).toString(),
        },
        level: Sentry.Severity.Info,
      })

      if (!documentIsPdf(doc)) {
        // Sentry: Unsupported document
        Sentry.captureMessage('Unsupported document', Sentry.Severity.Error)
        // Open unsupported document modal
        setIsUnsupported(true)
        return
      }

      // Document fetched successfully and it is a PDF file
      // Plausible: Open Document
      documentsOpenDocument(pathname, id)

      // Open document in browser
      const src = getPdfURL(doc.content)
      window.location.replace(src)
    }
  }, [called, loading, error, doc])

  return (
    <>
      {/* Display loader while we're fetching the document or while we're opening the document */}
      {(!called || loading || (doc && !isUnsupported)) && (
        <Box
          className={styles.loadingWrapper}
          position="fixed"
          top={0}
          right={0}
          bottom={0}
          left={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          background="white"
        >
          <LoadingIcon animate size={40} />
        </Box>
      )}
      {error && (
        <Box display="flex" justifyContent="center" paddingY={[5, 10]}>
          <Text variant="h2">
            {formatMessage({
              id: 'sp.documents:documentCard-error-singleDocument',
              defaultMessage: 'Ekki tókst að sækja skjal',
            })}
          </Text>
        </Box>
      )}
      {/* Unsupported document modal */}
      {isUnsupported && (
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
              defaultMessage: `Því miður bjóða mínar síður ekki upp
                    á stuðning við þetta skjal eins og er.
                    Þú getur farið á vef viðkomandi stofnunar
                    til þess að skoða skjalið.`,
            })}
          </Text>
        </Stack>
      )}
    </>
  )
}

export default Document
