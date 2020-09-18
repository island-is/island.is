import React from 'react'
import { useParams } from 'react-router-dom'

import { ApplicationForm } from '@island.is/application/form'
import { GET_APPLICATION } from '@island.is/application/graphql'
import { useQuery } from '@apollo/client'
import useAuth from '../hooks/useAuth'

export const Application = () => {
  const { id } = useParams()
  const { userInfo } = useAuth()

  const { data, error, loading } = useQuery(GET_APPLICATION, {
    variables: {
      input: {
        id: id,
      },
    },
    skip: !id,
  })

  if (!id) {
    return <p>Error there is no id</p>
  }
  if (error) {
    return <p>{error}</p>
  }
  if (loading) {
    return null
  }
  return (
    <ApplicationForm
      application={data.getApplication}
      nationalRegistryId={userInfo?.profile?.natreg}
    />
  )
}
