import React, { FC } from 'react'
import { ActionCard } from '@island.is/service-portal/core'
import { Document } from '@island.is/api/schema'
import { useLazyDocumentDetail } from '@island.is/service-portal/graphql'

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

interface Props {
  document: Document
}

const DocumentCard: FC<Props> = ({ document }) => {
  const { fetchDocument, loading, data } = useLazyDocumentDetail(document.id)
  const fileName = `${document.subject}.pdf`

  const handleOnDownload = () => {
    if (loading) {
      return
    }
    if (data) {
      downloadAsPdf(data, fileName)
      return
    }
    fetchDocument()
  }

  if (data) {
    downloadAsPdf(data, fileName)
  }
  return (
    <ActionCard
      title={document.subject}
      date={new Date(document.date)}
      label={document.senderName}
      key={document.id}
      onDownload={handleOnDownload}
    />
  )
}

export default DocumentCard
