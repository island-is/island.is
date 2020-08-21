import React, { FC } from 'react'
import { useQuery } from '@apollo/client'
import { useParams, Link } from 'react-router-dom'
import { GET_APPLICATIONS_BY_TYPE } from '@island.is/application/graphql'
import { Button } from '@island.is/island-ui/core'

export const Applications: FC<{}> = () => {
  const { type } = useParams()
  const { loading, error, data } = useQuery(GET_APPLICATIONS_BY_TYPE, {
    variables: {
      input: {
        typeId: type,
      },
    },
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error! {error.message}</p>

  return (
    <>
      <ul>
        {data?.getApplicationsByType.map((application) => (
          <li key={application.id}>
            <Link to={`/application/${application.id}`}>{application.id}</Link>
          </li>
        ))}
      </ul>
      <Link to={`/application`}>
        <Button icon="plus">Apply for a new one</Button>
      </Link>
    </>
  )
}
