import React, { useEffect } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { User } from 'oidc-client'

import { Query } from '@island.is/api/schema'

import { Box, Button, toast } from '@island.is/island-ui/core'

import * as s from './DownloadDraftButton.css'

import { useLocale } from '../utils'
import { buttonsMsgs } from '../messages'
import type {
  RegulationDraftId,
  RegulationPdfDownload,
} from '@island.is/regulations/admin'

type Props = {
  regulationDraftId: RegulationDraftId
  userInfo: User
}

const DownloadRegulationDraftQuery = gql`
  query downloadRegulation($input: DownloadRegulationInput!) {
    downloadRegulation(input: $input)
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

export function DownloadDraftButton({ userInfo, regulationDraftId }: Props) {
  const t = useLocale().formatMessage
  const [
    downloadRegulation,
    { called, loading, error, data },
  ] = useLazyQuery<Query>(DownloadRegulationDraftQuery, {
    variables: {
      input: {
        regulationId: regulationDraftId,
      },
    },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    if (error) {
      toast.error(t(buttonsMsgs.downloadDraftError))
    }
  }, [t, error])

  useEffect(() => {
    if (called && data) {
      const response = data.downloadRegulation as RegulationPdfDownload | null
      const url = response?.url

      if (url) {
        formSubmit(url, userInfo.access_token)
      } else {
        toast.error(t(buttonsMsgs.downloadDraftError))
      }
    }
  }, [called, data, userInfo.access_token, t])

  const onClick = async () => {
    downloadRegulation()
  }

  return (
    <Box
      marginBottom={[3, 3, 4]}
      display="flex"
      flexDirection="row"
      justifyContent="flexEnd"
    >
      <Box className={s.downloadDraftButton}>
        <Button
          loading={loading}
          onClick={onClick}
          icon="download"
          iconType="outline"
          variant="text"
          size="small"
        >
          {t(buttonsMsgs.downloadDraft)}
        </Button>
      </Box>
    </Box>
  )
}
