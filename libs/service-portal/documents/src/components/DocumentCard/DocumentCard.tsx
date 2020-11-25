import React, { FC, useEffect, useState } from 'react'
import { ActionCard, Modal } from '@island.is/service-portal/core'
import { Document } from '@island.is/api/schema'
import { useLazyDocumentDetail } from '@island.is/service-portal/graphql'
import { useLocale } from '@island.is/localization'
import * as styles from './DocumentCard.treat'
import { toast, Text, Stack, Button, Box } from '@island.is/island-ui/core'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
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
      downloadAsPdf(data.content, fileName)
      return
    }
    if (data?.url) {
      setIsModalOpen(true)
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

  const handleOnModalClose = () => {
    setIsModalOpen(false)
  }

  return (
    <>
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

export default DocumentCard
