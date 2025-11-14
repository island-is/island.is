import { useLazyQuery, useMutation } from '@apollo/client'
import { FormSystemApplication } from '@island.is/api/schema'
import {
  CREATE_APPLICATION,
  DELETE_APPLICATION,
  GET_ALL_APPLICATIONS,
} from '@island.is/form-system/graphql'
import {
  ApplicationList,
  ApplicationLoading,
  m,
} from '@island.is/form-system/ui'
import {
  Box,
  Button,
  GridContainer,
  Page,
  Text,
} from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'
interface Params {
  slug?: string
}

export const Applications = () => {
  useNamespaces('form.system')
  const { slug } = useParams() as Params
  const navigate = useNavigate()
  const [applications, setApplications] = useState<FormSystemApplication[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [createApplicationMutation] = useMutation(CREATE_APPLICATION, {
    onCompleted({ createApplication }) {
      if (slug) {
        console.log(createApplication)
      }
    },
  })

  const { formatMessage } = useIntl()

  const [getApplications] = useLazyQuery(GET_ALL_APPLICATIONS)

  const createApplication = useCallback(async () => {
    try {
      const app = await createApplicationMutation({
        variables: {
          input: {
            slug: slug,
            createApplicationDto: {
              isTest: true,
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
  }, [createApplicationMutation, slug, navigate])

  const fetchApplications = useCallback(async () => {
    try {
      const app = await getApplications({
        variables: {
          input: {
            slug: slug,
            isTest: true,
          },
        },
      })
      console.log('hoho', app)
      return app.data?.formSystemGetApplications?.applications
    } catch (error) {
      console.error('Error fetching applications:', error)
      return null
    }
  }, [getApplications, slug])

  useEffect(() => {
    const fetchData = async () => {
      const apps = await fetchApplications()
      if (apps && apps.length > 0) {
        setApplications(apps)
        setLoading(false)
      } else {
        createApplication()
      }
    }
    fetchData()
  }, [slug, createApplication, fetchApplications])

  const [deleteApplicationMutation] = useMutation(DELETE_APPLICATION)

  const deleteApplication = useCallback(
    async (applicationId: string) => {
      try {
        await deleteApplicationMutation({
          variables: {
            input: applicationId,
          },
        })
        setApplications((prev) =>
          prev.filter((app) => app.id !== applicationId),
        )
      } catch (error) {
        console.error('Error deleting application:', error)
      }
    },
    [deleteApplicationMutation],
  )

  if (loading) return <ApplicationLoading />

  return (
    <>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        marginTop={4}
        marginBottom={4}
      >
        <Text variant="h1">{formatMessage(m.yourApplications)}</Text>
        <Button variant="primary" onClick={createApplication}>
          {formatMessage(m.newApplication)}
        </Button>
      </Box>
      <Box marginTop={4}>
        <Page>
          <GridContainer>
            {applications.length > 0 && (
              <ApplicationList
                applications={applications}
                onDelete={deleteApplication}
              />
            )}
          </GridContainer>
        </Page>
      </Box>
    </>
  )
}
