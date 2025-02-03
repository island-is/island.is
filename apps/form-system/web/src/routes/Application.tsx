import { useParams } from "react-router-dom"
import { useUserInfo } from '@island.is/react-spa/bff'
import { Form } from "../components/Form/Form"
import { useQuery } from "@apollo/client"
import { GET_APPLICATION, removeTypename } from "../../../../../libs/portals/form-system/graphql/src"
import { ApplicationLoading } from "../components/ApplicationsLoading/ApplicationLoading"
import { FormSystemApplication } from '@island.is/api/schema'
import { ApplicationProvider } from "../context/ApplicationProvider"


type UseParams = {
  slug: string
  id: string
}

export const Application = () => {
  const { slug, id } = useParams() as UseParams
  const userInfo = useUserInfo()
  const nationalRegistryId = userInfo?.profile?.nationalId

  const { data, error, loading, refetch } = useQuery(GET_APPLICATION, {
    variables: {
      input: {
        id: id
      }
    },
    skip: !id
  })

  if (loading) {
    return <ApplicationLoading />
  }
  const application: FormSystemApplication = removeTypename(data.formSystemGetApplication)
  // if (!id || !slug) {
  //   return <ErrorShell errorType="notFound" />
  // }

  // if (!nationalRegistryId) {
  //   return (
  //     <ErrorShell
  //       errorType="notFound"
  //     />
  //   )
  // }


  return (
    <ApplicationProvider application={application}>
      <Form
        slug={slug}
        id={id}
      />
    </ApplicationProvider>
  )
}