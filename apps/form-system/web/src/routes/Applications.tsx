import { useNavigate, useParams } from 'react-router-dom'
import {
  CREATE_APPLICATION,
  GET_ALL_APPLICATIONS,
} from '@island.is/form-system/graphql'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useEffect, useState, useCallback } from 'react'
import { FormSystemApplication } from '@island.is/api/schema'
import {
  Box,
  Page,
  GridContainer,
  Text,
  Button,
  LoadingDots,
} from '@island.is/island-ui/core'
import { ApplicationList } from '@island.is/form-system/ui'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
interface Params {
  slug?: string
}

export const Applications = () => {
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
      } else {
        createApplication()
      }
      setLoading(false)
    }
    fetchData()
  }, [slug, createApplication, fetchApplications])

  if (loading) return <LoadingDots />

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
              <ApplicationList applications={applications} />
            )}
          </GridContainer>
        </Page>
      </Box>
    </>
  )
}
