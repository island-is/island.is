import { useEffect } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'

import { Button, toast } from '@island.is/island-ui/core'

import { useLocale } from '@island.is/localization'
import { editorMsgs, reviewMessages } from '../lib/messages'
import type { RegulationDraftId } from '@island.is/regulations/admin'
import { useAuth } from '@island.is/auth/react'

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

function formSubmit(url: string, token: string) {
  // Create form elements
  const form = document.createElement('form')
  const tokenInput = document.createElement('input')

  form.appendChild(tokenInput)

  // Form values
  form.method = 'post'
  form.action = url
  form.target = '_blank'

  // National Id values
  tokenInput.type = 'hidden'
  tokenInput.name = '__accessToken'
  tokenInput.value = token

  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}

export function DownloadDraftButton({ draftId, reviewButton }: Props) {
  const userInfo = useAuth().userInfo
  const t = useLocale().formatMessage
  const [downloadRegulation, { called, loading, error, data }] =
    useLazyQuery<Query>(DownloadRegulationDraftQuery, {
      variables: {
        input: {
          draftId,
        },
      },
      fetchPolicy: 'no-cache',
    })

  useEffect(() => {
    if (error) {
      toast.error(t(editorMsgs.signedDocumentDownloadFreshError))
    }
  }, [t, error])

  useEffect(() => {
    if (called && data) {
      const response = data.getDraftRegulationPdfDownload
      const url = response?.url

      if (url && userInfo) {
        formSubmit(url, userInfo.access_token)
      } else {
        toast.error(t(editorMsgs.signedDocumentDownloadFreshError))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [called, data, userInfo?.access_token])

  const onClick = async () => {
    downloadRegulation()
  }

  if (reviewButton) {
    return (
      <Button
        loading={loading}
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
    <Button loading={loading} onClick={onClick} icon="download">
      {t(editorMsgs.signedDocumentDownloadFresh)}
    </Button>
  )
}
