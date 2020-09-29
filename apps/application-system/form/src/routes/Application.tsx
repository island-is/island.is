import React from 'react'
import { useParams } from 'react-router-dom'
import { ApplicationForm } from '@island.is/application/form'
import { useNamespaces } from '@island.is/localization'
import useAuth from '../hooks/useAuth'

export const Application = () => {
  const { id } = useParams()
  const { userInfo } = useAuth()
  useNamespaces(['dl.application', 'pl.application', 'application.system'])

  const nationalRegistryId = userInfo?.profile?.natreg

  if (!id) {
    return <p>Error there is no id</p>
  }
  if (!nationalRegistryId) {
    return null
  }

  return (
    <ApplicationForm
      applicationId={id}
      nationalRegistryId={nationalRegistryId}
    />
  )
}
