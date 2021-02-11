import React from 'react'
import { useParams } from 'react-router-dom'
import { ApplicationForm, NotFound } from '@island.is/application/ui-shell'
import { useLocale, useNamespaces } from '@island.is/localization'
import { coreMessages } from '@island.is/application/core'

import useAuth from '../hooks/useAuth'

export const Application = () => {
  const { id } = useParams()
  const { userInfo } = useAuth()
  const { formatMessage } = useLocale()

  useNamespaces([
    'dl.application',
    'pl.application',
    'hi.application',
    'application.system',
    'example.application',
    'dpo.application',
  ])

  const nationalRegistryId = userInfo?.profile?.nationalId

  if (!id) {
    return <NotFound />
  }

  if (!nationalRegistryId) {
    return (
      <NotFound
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
