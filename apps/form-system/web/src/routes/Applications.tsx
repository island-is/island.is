import { useNavigate, useParams } from "react-router-dom"
import { CREATE_APPLICATION, GET_APPLICATIONS } from "@island.is/form-system/graphql"
import { useMutation, useQuery, useLazyQuery } from "@apollo/client"
import { Button } from "@island.is/island-ui/core"

interface Params {
  slug: string
}

export const Applications = () => {
  const { slug } = useParams() as unknown as Params
  const navigate = useNavigate()
  //const { formatMessage } = useLocale()
  const [createApplicationMutation, { error: createError }] = useMutation(
    CREATE_APPLICATION, {
    onCompleted({ createApplication }) {
      if (slug) {
        console.log(createApplication)
      }
    }
  })

  const [getApplications] = useLazyQuery(GET_APPLICATIONS, {
    onCompleted({ getApplications }) {
      if (slug) {
        console.log(getApplications)
      }
    }
  })

  const createApplication = async () => {
    const app = await createApplicationMutation({
      variables: {
        input: {
          slug: slug,
          createApplicationDto: {
            isTest: false
          }
        }
      }
    })
    if (app) {
      navigate(`../${slug}/${app.data.createFormSystemApplication.id}`)
    }
    return app
  }

  const fetchApplications = async () => {
    const apps = await getApplications({
      variables: {
        input: {
          formId: 'dd81c73f-504e-4cee-b3f5-3161be4f20e9',
          page: 1,
          limit: 100,
          isTest: false,
        }
      }
    })
    console.log(apps)
  }

  console.log('slug', slug)
  // Check whether the user has opened this form before and if so, show all the applications 
  const applications = []
  // Assuming the user has not opened this form before, create a new application
  if (applications.length === 0) {
  }

  return (
    <>
      <Button onClick={createApplication}>Create</Button>
      <Button onClick={fetchApplications}>Get</Button>
    </>
  )
}