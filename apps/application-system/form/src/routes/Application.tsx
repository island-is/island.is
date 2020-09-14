import React from 'react'
import { useParams, Link, useRouteMatch } from 'react-router-dom'

import { ApplicationForm } from '@island.is/application/form'
import { GET_APPLICATION } from '@island.is/application/graphql'
import { useQuery } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { Typography } from '@island.is/island-ui/core'

export const Application = () => {
  const { id } = useParams()
  const { url } = useRouteMatch()
  const { loadingMessages, formatMessage } = useLocale('applications')

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
  if (loading || loadingMessages) {
    return <p>Loading</p>
  }
  return (
    <>
      <Typography>
        {formatMessage({
          id: 'applications:title',
        })}
      </Typography>
      <Link to={`/test`}>Go to test route</Link>
      <ApplicationForm application={data.getApplication} />
    </>
  )
}
