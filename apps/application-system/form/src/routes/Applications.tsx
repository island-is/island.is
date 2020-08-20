import React from 'react'
import { useQuery } from '@apollo/client'
import { useParams, Link } from 'react-router-dom'
import { GET_APPLICATIONS_BY_TYPE } from '@island.is/application/graphql'

export const Applications = () => {
  const { type } = useParams()

  const { loading, error, data } = useQuery(GET_APPLICATIONS_BY_TYPE, {
    variables: {
      input: {
        typeId: type,
      },
    },
  })

  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`

  return (
    <ul>
      {data?.getApplicationsByType.map((application) => (
        <li key={application.id}>
          <Link to={`/application/${application.id}`}>{application.id}</Link>
        </li>
      ))}
    </ul>
  )
}
