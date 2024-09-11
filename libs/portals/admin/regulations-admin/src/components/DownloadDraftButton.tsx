import { gql, useLazyQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { useEffect, useState } from 'react'

import { Button, toast } from '@island.is/island-ui/core'

import { useLocale } from '@island.is/localization'
import { useBffUrlGenerator } from '@island.is/react-spa/bff'
import type { RegulationDraftId } from '@island.is/regulations/admin'
import { editorMsgs, reviewMessages } from '../lib/messages'

type Props = {
  draftId: RegulationDraftId
  reviewButton?: boolean
}

const DownloadRegulationDraftQuery = gql`
  query downloadRegulation($input: GetDraftRegulationPdfDownloadInput!) {
    getDraftRegulationPdfDownload(input: $input) {
      downloadService
      url
    }
  }
`

export const DownloadDraftButton = ({ draftId, reviewButton }: Props) => {
  const bffUrlGenerator = useBffUrlGenerator()
  const [isFetchingFile, setIsFetchingFile] = useState(false)
  const t = useLocale().formatMessage
  const [downloadRegulation, { loading, error, data }] = useLazyQuery<Query>(
    DownloadRegulationDraftQuery,
    {
      variables: {
        input: {
          draftId,
        },
      },
      fetchPolicy: 'no-cache',
    },
  )

  useEffect(() => {
    if (error) {
      toast.error(t(editorMsgs.signedDocumentDownloadFreshError))
    }
  }, [t, error])

  useEffect(() => {
    const url = data?.getDraftRegulationPdfDownload?.url

    if (url && !isFetchingFile) {
      setIsFetchingFile(true)

      fetch(bffUrlGenerator(`/api?url=${url}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then((response) => {
          if (response.ok) {
            // Convert response to blob for download
            response.blob().then((blob) => {
              const downloadUrl = URL.createObjectURL(blob)
              // Open the download URL in a new tab
              window.open(downloadUrl, '_newtab')
            })
          } else {
            toast.error(t(editorMsgs.signedDocumentDownloadFreshError))
          }
        })
        .catch((error) => {
          console.error('Error occurred:', error)
          toast.error(t(editorMsgs.signedDocumentDownloadFreshError))
        })
        .finally(() => {
          setIsFetchingFile(false)
        })
    } else {
      toast.error(t(editorMsgs.signedDocumentDownloadFreshError))
    }
  }, [data])

  const onClick = async () => {
    downloadRegulation()
  }

  const isLoading = loading || isFetchingFile

  if (reviewButton) {
    return (
      <Button
        loading={isLoading}
        as="button"
        onClick={onClick}
        icon="download"
        variant="ghost"
        size="small"
        iconType="outline"
      >
        {t(reviewMessages.downloadPDFVersion)}
      </Button>
    )
  }

  return (
    <Button loading={isLoading} onClick={onClick} icon="download">
      {t(editorMsgs.signedDocumentDownloadFresh)}
    </Button>
  )
}
