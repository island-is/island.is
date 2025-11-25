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
import { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorShell } from '@island.is/application/ui-shell'

interface Params {
  slug?: string
}

export const Applications = () => {
  useNamespaces('form.system')
  const { slug } = useParams() as Params
  const navigate = useNavigate()
  const [applications, setApplications] = useState<FormSystemApplication[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loginAllowed, setLoginAllowed] = useState(true)
  const [createApplicationMutation] = useMutation(CREATE_APPLICATION)

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

      if (app.data?.createFormSystemApplication?.isLoginTypeAllowed === false) {
        setLoginAllowed(false)
      } else if (app.data?.createFormSystemApplication?.application?.id) {
        navigate(
          `../${slug}/${app.data.createFormSystemApplication.application.id}`,
        )
      }
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
          },
        },
      })

      const dto = app.data?.formSystemGetApplications
      if (dto?.isLoginTypeAllowed === false) {
        setLoginAllowed(false)
        return null
      }
      return dto
    } catch (error) {
      console.error('Error fetching applications:', error)
      return null
    }
  }, [getApplications, slug])

  const hasInitializedRef = useRef(false)

  useEffect(() => {
    if (hasInitializedRef.current) return
    hasInitializedRef.current = true
    let isMounted = true

    const run = async () => {
      const responseDto = await fetchApplications()
      if (!isMounted || !responseDto) {
        if (isMounted) {
          setLoading(false)
        }
        return
      }
      const apps = responseDto.applications || []
      if (apps.length > 0) {
        setApplications(apps)
        setLoading(false)
      } else if (loginAllowed) {
        await createApplication()
        setLoading(false)
      }
    }
    run()

    return () => {
      isMounted = false
    }
  }, [slug, createApplication, fetchApplications, loginAllowed])

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

  if (!loginAllowed) {
    return (
      <ErrorShell
        title={formatMessage(m.switchLoginToCreateApplication)}
        subTitle={formatMessage(m.applicationDoesNotPermitLogin)}
        description=""
      />
    )
  }

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
