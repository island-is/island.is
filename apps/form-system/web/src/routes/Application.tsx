import { useQuery } from '@apollo/client'
import { GET_APPLICATION, removeTypename } from '@island.is/form-system/graphql'
import { ApplicationLoading } from '@island.is/form-system/ui'
import { useParams } from 'react-router-dom'
import { ErrorShell } from '../components/ErrorShell/ErrorShell'
import { ApplicationProvider } from '../context/ApplicationProvider'

type UseParams = {
  slug: string
  id: string
}

export const Application = () => {
  const { slug, id } = useParams() as UseParams
  const isPaymentReturn =
    typeof window !== 'undefined' && window.location.search.includes('done')

  const { data, loading, error, refetch } = useQuery(GET_APPLICATION, {
    variables: {
      input: { id, slug },
    },
    skip: !id || !slug,
    fetchPolicy: isPaymentReturn ? 'network-only' : 'cache-first',
    notifyOnNetworkStatusChange: true,
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
