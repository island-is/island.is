import React from 'react'
import { useParams } from 'react-router-dom'

import { ApplicationForm, ErrorShell } from '@island.is/application/ui-shell'
import { useLocale } from '@island.is/localization'
import { coreMessages } from '@island.is/application/core'
import { useAuth } from '@island.is/auth/react'

export const Application = () => {
  const { slug, id } = useParams<{ slug: string; id: string }>()
  const { userInfo } = useAuth()
  const { formatMessage } = useLocale()
  const nationalRegistryId = userInfo?.profile?.nationalId

  if (!id || !slug) {
    return <ErrorShell />
  }

  if (!nationalRegistryId) {
    return (
      <ErrorShell
        title={formatMessage(coreMessages.notLoggedIn)}
        subTitle={formatMessage(coreMessages.notLoggedInDescription)}
      />
    )
  }

  return (
    <ApplicationForm
      applicationId={id}
      nationalRegistryId={nationalRegistryId}
    />
  )
}
