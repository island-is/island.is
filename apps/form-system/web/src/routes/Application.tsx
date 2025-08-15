import { useParams } from 'react-router-dom'
import { ApplicationProvider } from '../context/ApplicationProvider'
import { GET_APPLICATION, removeTypename } from '@island.is/form-system/graphql'
import { useQuery } from '@apollo/client'
import { ApplicationLoading } from '@island.is/form-system/ui'
import { NotFound } from '@island.is/portals/core'

type UseParams = {
  slug: string
  id: string
}

export const Application = () => {
  const { slug, id } = useParams() as UseParams
  const { data, error, loading } = useQuery(GET_APPLICATION, {
    variables: { input: { id } },
    skip: !id,
    fetchPolicy: 'cache-first',
  })

  if (!id || !slug) {
    return <NotFound />
  }

  if (loading) {
    return <ApplicationLoading />
  }

  if (error) {
    return <div>Error</div>
  }

  return (
    <ApplicationProvider
      application={removeTypename(data?.formSystemApplication)}
    />
  )
}
