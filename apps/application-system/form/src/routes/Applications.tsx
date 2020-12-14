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
import { NotFound } from '@island.is/application/ui-shell'

export const Applications: FC = () => {
  const { type } = useParams()
  const history = useHistory()
  const { userInfo } = useAuth()
  const nationalRegistryId = userInfo?.profile?.nationalId

  const { data, loading, error: applicationsError } = useQuery(
    APPLICANT_APPLICATIONS,
    {
      variables: {
        typeId: type,
      },
    },
  )

  const [createApplicationMutation, { error: createError }] = useMutation(
    CREATE_APPLICATION,
    {
      onCompleted({ createApplication }) {
        history.push(`../umsokn/${createApplication.id}`)
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
    })
  }

  useEffect(() => {
    if (data && isEmpty(data.getApplicationsByApplicant)) {
      createApplication()
    }
  }, [data])

  if (applicationsError)
    return (
      <NotFound
        title="Þessi gerð umsókna er ekki til"
        subTitle={`Engin umsókn er til af gerðinni: ${type}`}
      />
    )
  if (createError)
    return (
      <NotFound
        title="Eitthvað fór úrskeiðis"
        subTitle={`Ekki tókst að búa til umsókn af gerðinni: ${type}`}
      />
    )

  return (
    <Page>
      {!loading && !isEmpty(data?.getApplicationsByApplicant) && (
        <Box padding="containerGutter">
          <Box marginTop={5} marginBottom={5}>
            <Text variant="h1">Þínar umsóknir</Text>
          </Box>
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
                    onClick: () => history.push(`../umsokn/${application.id}`),
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
