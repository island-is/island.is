import { useNavigate, useParams } from 'react-router-dom'
import {
  CREATE_APPLICATION,
} from '@island.is/form-system/graphql'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { FormSystemApplication } from '@island.is/api/schema'
import {
  Box,
  Page,
  Button,
  GridContainer,
  Inline,
} from '@island.is/island-ui/core'
import { ApplicationList } from '@island.is/form-system/ui'

interface Params {
  slug?: string
}

export const Applications = () => {
  const { slug } = useParams() as Params
  const navigate = useNavigate()
  const [applications, setApplications] = useState<FormSystemApplication[]>([])
  const [createApplicationMutation] = useMutation(
    CREATE_APPLICATION,
    {
      onCompleted({ createApplication }) {
        if (slug) {
          console.log(createApplication)
        }
      },
    },
  )

  // TODO: Uncomment when the endpoint is ready
  // const [getApplications] = useLazyQuery(GET_APPLICATIONS, {
  //   onCompleted({ getApplications }) {
  //     if (slug) {
  //       console.log(getApplications)
  //     }
  //   }
  // })

  const createApplication = async () => {
    try {
      const app = await createApplicationMutation({
        variables: {
          input: {
            slug: slug,
            createApplicationDto: {
              isTest: false,
            },
          },
        },
      })
      if (app.data?.createFormSystemApplication?.id) {
        navigate(`../${slug}/${app.data.createFormSystemApplication.id}`)
      }
      return app
    } catch (error) {
      console.error('Error creating application:', error)
      return null
    }
  }

  // This is a dummy to demonstrate how it looks when there are multiple applications for a form
  const getApplications = async () => {
    const app = await createApplicationMutation({
      variables: {
        input: {
          slug: slug,
          createApplicationDto: {
            isTest: false,
          },
        },
      },
    })
    setApplications([
      app.data.createFormSystemApplication,
      app.data.createFormSystemApplication,
      app.data.createFormSystemApplication,
    ])
  }

  // Check whether the user has opened this form before and if so, show all the applications
  // const applications = []
  // Assuming the user has not opened this form before, create a new application


  return (
    <>
      <Inline space={2}>
        <Button onClick={createApplication}>Create</Button>
        <Button onClick={getApplications}>Get</Button>
      </Inline>
      <Box marginTop={4}>
        <Page>
          <GridContainer>
            {applications.length > 0 && (
              <ApplicationList applications={applications} />
            )}
          </GridContainer>
        </Page>
      </Box>
    </>
  )
}
