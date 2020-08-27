import React from 'react'
import { useParams, useHistory, useRouteMatch } from 'react-router-dom'

import { ApplicationForm } from '@island.is/application/form'
import { FormType } from '@island.is/application/schema'
import { GET_APPLICATION } from '@island.is/application/graphql'
import { useQuery } from '@apollo/client'

export const Application = () => {
  const { id } = useParams()
  const history = useHistory()
  const match = useRouteMatch()

  const { data, loading } = useQuery(GET_APPLICATION, {
    variables: {
      input: {
        id: id,
      },
    },
    skip: !id,
  })

  return (
    <ApplicationForm
      formType={data?.getApplication?.typeId ?? FormType.PATERNITY_LEAVE}
      applicationId={data?.getApplication?.id}
      initialAnswers={data?.getApplication?.answers}
      loadingApplication={loading}
      onApplicationCreated={(id) => history.replace(`${match.url}/${id}`)}
    />
  )
}
