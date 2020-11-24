import React, { FC, useEffect } from 'react'
import { ActionCard } from '@island.is/service-portal/core'
import { Document } from '@island.is/api/schema'
import { useLazyDocumentDetail } from '@island.is/service-portal/graphql'
import { useLocale } from '@island.is/localization'
import { toast } from '@island.is/island-ui/core'

const base64ToArrayBuffer = (base64Pdf: string) => {
  let binaryString = window.atob(base64Pdf)
  let binaryLen = binaryString.length
  let bytes = new Uint8Array(binaryLen)
  for (let i = 0; i < binaryLen; i++) {
    let ascii = binaryString.charCodeAt(i)
    bytes[i] = ascii
  }
  return bytes
}

const downloadAsPdf = (base64Pdf: string) => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    let byte = base64ToArrayBuffer(base64Pdf)
    let blob = new Blob([byte], { type: 'application/pdf' })
    window.open(URL.createObjectURL(blob), '_blank')
  } catch (error) {}
}

interface Props {
  document: Document
}

const DocumentCard: FC<Props> = ({ document }) => {
  const { formatMessage } = useLocale()
  const { fetchDocument, loading, data, error } = useLazyDocumentDetail(
    document.id,
  )
  useEffect(() => {
    if (data || error) {
      handleOnFetch()
    }
  }, [data, error])

  const handleOnFetch = () => {
    if ((data?.fileType || '').toLowerCase() === 'pdf' && data?.content) {
      downloadAsPdf(data.content)
      return
    }
    if (data?.url) {
      return
    }

    if (error && !loading) {
      toast.error(
        formatMessage({
          id: 'sp.documents:documentCard-error-singleDocument',
          defaultMessage: 'Ekki tókst að sækja skjal',
        }),
      )
    }
  }

  const handleOnClick = () => {
    if (loading) {
      return
    }
    if (!data) {
      fetchDocument()
    } else {
      handleOnFetch()
    }
  }

  return (
    <ActionCard
      title={document.subject}
      date={new Date(document.date)}
      label={document.senderName}
      key={document.id}
      loading={loading}
      cta={{
        onClick: handleOnClick,
        label: formatMessage({
          id: 'sp.documents:documentCard-ctaLabel',
          defaultMessage: 'Sækja skjal',
        }),
      }}
    />
  )
}

export default DocumentCard
