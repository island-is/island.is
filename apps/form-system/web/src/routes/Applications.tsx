import { useNavigate, useParams } from "react-router-dom"
import { CREATE_APPLICATION, GET_APPLICATIONS } from "@island.is/form-system/graphql"
import { useMutation, useQuery, useLazyQuery } from "@apollo/client"
import { Box, Button, Inline, Stack } from "@island.is/island-ui/core"
import { useEffect, useState } from "react"
import { FormSystemApplication } from "@island.is/api/schema"
import { ApplicationCard } from "@island.is/application/ui-components"

interface Params {
  slug: string
}

export const Applications = () => {
  const { slug } = useParams() as unknown as Params
  const navigate = useNavigate()
  const [applications, setApplications] = useState<FormSystemApplication[]>([])
  //const { formatMessage } = useLocale()
  const [createApplicationMutation, { error: createError }] = useMutation(
    CREATE_APPLICATION, {
    onCompleted({ createApplication }) {
      if (slug) {
        console.log(createApplication)
      }
    }
  })

  // const [getApplications] = useLazyQuery(GET_APPLICATIONS, {
  //   onCompleted({ getApplications }) {
  //     if (slug) {
  //       console.log(getApplications)
  //     }
  //   }
  // })

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

  const getApplications = async () => {
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
    setApplications([app.data.createFormSystemApplication, app.data.createFormSystemApplication, app.data.createFormSystemApplication])

  }

  console.log('slug', slug)
  // Check whether the user has opened this form before and if so, show all the applications 
  // const applications = []
  // Assuming the user has not opened this form before, create a new application

  useEffect(() => {
    console.log(applications)
  }, [applications])

  return (
    <>
      <Inline space={2}>
        <Button onClick={createApplication}>Create</Button>
        <Button onClick={getApplications}>Get</Button>
      </Inline>
      <Box marginTop={4}>
        {/* {applications.length > 0 && 
        <Stack space={2}>
          {applications.map((application) => (
            <ApplicationCard
          ))}
        </Stack>} */}
      </Box>
    </>
  )
}