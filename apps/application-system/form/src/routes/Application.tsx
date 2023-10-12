import React from 'react'
import { useParams } from 'react-router-dom'

import { ApplicationForm, ErrorShell } from '@island.is/application/ui-shell'
import { useLocale } from '@island.is/localization'
import { coreMessages } from '@island.is/application/core'
import { useAuth } from '@island.is/auth/react'
import { slugMapper } from '../routes/slugMapper'

type UseParams = {
  slug: string
  id: string
}

export const Application = () => {
  const { slug, id } = useParams() as UseParams
  const { userInfo } = useAuth()
  const { formatMessage } = useLocale()
  const nationalRegistryId = userInfo?.profile?.nationalId

  if (!id || !slug) {
    return <ErrorShell errorType="notFound" />
  }

  if (!nationalRegistryId) {
    return (
      <ErrorShell
        errorType="notFound"
        title={formatMessage(coreMessages.notLoggedIn)}
        subTitle={formatMessage(coreMessages.notLoggedInDescription)}
      />
    )
  }

  return (
    <ApplicationForm
      applicationId={id}
      nationalRegistryId={nationalRegistryId}
      slug={slug}
      useJSON={slugMapper[slug] || false}
    />
  )
}
