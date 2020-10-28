import React, { FC, useEffect } from 'react'
import { ActionCard } from '@island.is/service-portal/core'
import { Document } from '@island.is/api/schema'
import { useLazyDocumentDetail } from '@island.is/service-portal/graphql'
import { useLocale } from '@island.is/localization'
import { toast } from '@island.is/island-ui/core'

const downloadAsPdf = (base64Pdf: string, fileName: string) => {
  if (typeof window === 'undefined') {
    return
  }
  const fakeLink = window.document.createElement('a')
  const url = `data:application/pdf;base64,${base64Pdf}`
  fakeLink.href = url
  fakeLink.download = fileName
  fakeLink.title = fileName
  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url)
      fakeLink.removeEventListener('click', clickHandler)
    }, 150)
  }
  fakeLink.addEventListener('click', clickHandler, false)
  fakeLink.click()
}

const openExternalDocument = (url: string) => {
  if (typeof window === 'undefined') {
    return
  }
  window.open(url, '_blank')
}

interface Props {
  document: Document
}

const DocumentCard: FC<Props> = ({ document }) => {
  const fileName = `${document.subject}.pdf`
  const { formatMessage } = useLocale()
  const { fetchDocument, loading, data, error } = useLazyDocumentDetail(
    document.id,
  )

  useEffect(() => {
    if (data) {
      handleOnFetch()
    }
  }, [data])

  const handleOnFetch = () => {
    if (data?.fileType === 'pdf' && data?.content) {
      downloadAsPdf(data.content, fileName)
      return
    }
    if (data?.url) {
      openExternalDocument(data.url)
      return
    }
    if (error && !loading) {
      toast.error(
        formatMessage({
          id: 'sp.documents:documentCard.errorLoadingDocument',
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
    }
    handleOnFetch()
  }

  return (
    <ActionCard
      title={document.subject}
      date={new Date(document.date)}
      label={document.senderName}
      key={document.id}
      cta={{
        onClick: handleOnClick,
        label: formatMessage({
          id: 'sp.documents:documentCard.ctaLabel',
          defaultMessage: 'Sækja skjal',
        }),
      }}
    />
  )
}

export default DocumentCard
