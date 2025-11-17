import { useParams } from 'react-router-dom'
import { ApplicationProvider } from '../context/ApplicationProvider'
import { GET_APPLICATION, removeTypename } from '@island.is/form-system/graphql'
import { useQuery } from '@apollo/client'
import { ApplicationLoading } from '@island.is/form-system/ui'
import { ErrorShell } from '@island.is/application/ui-shell'

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
    return <ErrorShell errorType="notFound" />
  }

  if (loading) {
    return <ApplicationLoading />
  }

  const formSystemApp = data?.formSystemApplication
  const isLoginTypeAllowed = formSystemApp?.isLoginTypeAllowed
  const application = removeTypename(formSystemApp?.application)

  if (error || isLoginTypeAllowed === false || !application) {
    return <ErrorShell errorType="idNotFound" />
  }

  return <ApplicationProvider application={application} />
}
