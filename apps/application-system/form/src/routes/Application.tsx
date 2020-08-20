import React from 'react'
import { useParams, useHistory, useRouteMatch } from 'react-router-dom'

import { ApplicationForm } from '@island.is/application/form'
import { ExampleForm3, FormType } from '@island.is/application/schema'
import { GET_APPLICATION } from '@island.is/application/graphql'
import { useQuery } from '@apollo/client'

export const Application = () => {
  const { id } = useParams()
  //   const history = useHistory()
  //   const match = useRouteMatch()

  const { loading, error, data } = useQuery(GET_APPLICATION, {
    variables: {
      input: {
        id: id,
      },
    },
    skip: !id,
  })

  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`

  return (
    <ApplicationForm
      formType={FormType.EXAMPLE3}
      applicationId={data?.getApplication?.id}
      initialAnswers={data?.getApplication?.answers}
      //   onApplicationCreated={(id) => history.replace(`${match.url}/${id}`)}
    />
  )
}
