import React, { FC, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useParams, useHistory } from 'react-router-dom'
import format from 'date-fns/format'
import isEmpty from 'lodash/isEmpty'
import {
  CREATE_APPLICATION,
  APPLICANT_APPLICATIONS,
} from '@island.is/application/graphql'
import useAuth from '../hooks/useAuth'
import {
  Text,
  Box,
  Stack,
  ActionCard,
  Page,
  Button,
} from '@island.is/island-ui/core'
import { Application } from '@island.is/application/core'

export const Applications: FC = () => {
  const { type } = useParams()
  const history = useHistory()
  const { userInfo } = useAuth()
  const nationalRegistryId = userInfo?.profile?.nationalId

  const { data, loading, error: applicationsError } = useQuery(
    APPLICANT_APPLICATIONS,
    {
      variables: {
        input: {
          nationalRegistryId: nationalRegistryId,
          typeId: type,
        },
      },
    },
  )

  const [createApplicationMutation, { error: createError }] = useMutation(
    CREATE_APPLICATION,
    {
      onCompleted({ createApplication }) {
        history.push(`../application/${createApplication.id}`)
      },
    },
  )

  function createApplication() {
    createApplicationMutation({
      variables: {
        input: {
          applicant: nationalRegistryId,
          state: 'draft',
          attachments: {},
          typeId: type,
          assignees: [nationalRegistryId],
          answers: {},
        },
      },
      refetchQueries: ['GetApplicantApplications'],
    })
  }

  useEffect(() => {
    if (data && isEmpty(data.getApplicationsByApplicant)) {
      createApplication()
    }
  }, [data])

  if (createError) return <p>Error! {createError.message}</p>

  return (
    <Page>
      {!loading && !isEmpty(data?.getApplicationsByApplicant) && (
        <Box padding="containerGutter">
          <Box marginTop={5} marginBottom={5}>
            <Text variant="h1">Þínar umsóknir</Text>
          </Box>
          {applicationsError && (
            <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
              <Text variant="h3">
                Tókst ekki að sækja umsóknir, eitthvað fór úrskeiðis
              </Text>
            </Box>
          )}
          <Stack space={2}>
            {data?.getApplicationsByApplicant?.map(
              (application: Application) => (
                <ActionCard
                  key={application.id}
                  heading={application.name || application.typeId}
                  text={format(new Date(application.modified), 'do MMMM yyyy')}
                  cta={{
                    label: 'Halda áfram',
                    variant: 'secondary',
                    onClick: () =>
                      history.push(`../application/${application.id}`),
                  }}
                  progressMeter={{
                    active: true,
                    progress: application.progress,
                  }}
                />
              ),
            )}
          </Stack>
          <Box
            marginTop={5}
            marginBottom={5}
            display="flex"
            justifyContent="flexEnd"
          >
            <Button onClick={createApplication}>Ný umsókn</Button>
          </Box>
        </Box>
      )}
    </Page>
  )
}
