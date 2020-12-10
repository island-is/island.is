import React from 'react'
import { useParams } from 'react-router-dom'
import { ApplicationForm, NotFound } from '@island.is/application/ui-shell'
import { useNamespaces } from '@island.is/localization'
import useAuth from '../hooks/useAuth'

export const Application = () => {
  const { id } = useParams()
  const { userInfo } = useAuth()
  useNamespaces([
    'dl.application',
    'pl.application',
    'application.system',
    'example.application',
  ])

  const nationalRegistryId = userInfo?.profile?.nationalId

  if (!id) {
    return <NotFound />
  }
  if (!nationalRegistryId) {
    return (
      <NotFound
        title="Þú þarft að vera skrá þig inn."
        subTitle="Til að halda áfram umsóknarferli þarftu að skrá þig inn."
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
