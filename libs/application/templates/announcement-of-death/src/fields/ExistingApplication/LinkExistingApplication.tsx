import React, { FC, useCallback, useEffect, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { getValueViaPath, formatText } from '@island.is/application/core'
import {
  FieldBaseProps,
  Application,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import { ApplicationList } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import { useNavigate } from 'react-router-dom'
import { useDeleteApplication } from './hooks/useDeleteApplication'
import { EstateRegistrant } from '@island.is/clients/syslumenn'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'

enum ACTION {
  EXISTING = 'existing',
  NEW = 'new',
}
interface IContinueConf {
  url: string
  action: ACTION
}

export const LinkExistingApplication: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, field, refetch, goToScreen }) => {
  const { locale, formatMessage } = useLocale()
  const { description } = field
  const navigate = useNavigate()
  const [continueConf, setContinueConf] = useState<IContinueConf>()
  const [updateApplication, { loading }] = useMutation(UPDATE_APPLICATION)
  const [updateApplicationExternalData, { loading: _externalDataLoading }] =
    useMutation(UPDATE_APPLICATION_EXTERNAL_DATA)

  const { deleteApplication, loading: deleteLoading } = useDeleteApplication()

  const changeScreens = (screen: string) => {
    if (goToScreen) goToScreen(screen)
  }

  const assignEstateToAnswers = useCallback(
    async (estate: EstateRegistrant | undefined) => {
      if (estate) {
        const res = await updateApplication({
          variables: {
            input: {
              id: application.id,
              answers: {
                ...application.answers,
                ...{
                  ...estate,
                  assets: { assets: estate.assets },
                  estateMembers: { members: estate.estateMembers },
                  vehicles: { vehicles: estate.vehicles },
                },
              },
            },
            locale,
          },
        })
        if (!res.data && refetch) {
          refetch()
        }
      }
    },
    [],
  )

  const getNewEstateFromUrl = (url: string) => {
    const caseNumber = url.split('/').pop()
    return estates.find((estate) => estate.caseNumber === caseNumber)
  }

  useEffect(() => {
    const handleContinue = async () => {
      if (continueConf) {
        switch (continueConf.action) {
          case ACTION.EXISTING:
            {
              const navigationApplicationId = continueConf.url.split('/').pop()
              // Delete other casenumber applications
              // These are assigned to the same caseNumber in the ExistingApplicationProvider
              for (const existingApplication of existing) {
                if (existingApplication.id !== navigationApplicationId) {
                  await deleteApplication(existingApplication.id)
                }
              }

              await deleteApplication(application.id)

              // Upon deleting other applications we re-apply the
              // ExistingApplication provider to the
              await updateApplicationExternalData({
                variables: {
                  input: {
                    id: navigationApplicationId,
                    dataProviders: [
                      {
                        actionId: 'Application.existingApplication',
                        order: 0,
                      },
                    ],
                  },
                  locale,
                },
              })
              if (!deleteLoading) {
                // push to existing application
                navigate(`../../${continueConf.url}`)
              }
            }
            break
          case ACTION.NEW:
            {
              // get estate from casenumber in url
              const estate = getNewEstateFromUrl(continueConf.url)
              // update answers with estate
              await assignEstateToAnswers(estate)
              // continue to next screen
              if (!loading) {
                changeScreens('list')
              }
            }
            break
          default:
            break
        }
      }
    }
    handleContinue()
  }, [continueConf])

  const existing =
    getValueViaPath<Application[]>(
      application.externalData,
      'existingApplication.data',
    ) ?? []

  // TODO: a future implementation will keep an array of estates
  // in external data for a selector.
  // For now the first application from Sysla is selected into 'estate'.
  // In the case of multiple available announcements the user will progress
  // through them in order but in the future (next iteration) will have a choice.
  // This will happen before the feature flag is lifted.
  // As such the processing logic acts as if an array of estates is available.
  const estate = getValueViaPath<EstateRegistrant>(
    application.externalData,
    'syslumennOnEntry.data.estate',
    undefined,
  )
  const estates = estate ? [estate] : []

  const caseNumbers: string[] = []

  const mappedExisting = existing.map((app) => {
    const name =
      getValueViaPath<Application[]>(
        app.externalData,
        'syslumennOnEntry.data.estate.nameOfDeceased',
      ) ?? ''
    caseNumbers[caseNumbers.length] =
      getValueViaPath<Application[]>(
        app.externalData,
        'syslumennOnEntry.data.estate.caseNumber',
      )?.toString() ?? ''
    return {
      ...app,
      name: `${formatText(
        m.applicationTitle,
        application,
        formatMessage,
      )} ${name}`,
    }
  })

  // Map estates to ApplicationList param type
  // Filter out estates that already have an active application
  const mappedEstates = estates
    .filter((estate) => !caseNumbers.includes(estate.caseNumber))
    .map((estate) => {
      return {
        id: estate.caseNumber,
        state: ApplicationStatus.NOT_STARTED,
        actionCard: {
          title: estate.nameOfDeceased,
        },
        typeId: ApplicationTypes.ANNOUNCEMENT_OF_DEATH,
        modified: new Date(),
        name: estate.nameOfDeceased,
        progress: 0,
        status: ApplicationStatus.NOT_STARTED,
      }
    })

  // TODO: Add delete on existing applications
  // Will need to refetch existing applications and reload
  // or get delete indication from ApplicationList and add estate from deleted application to mapped estates
  return (
    <>
      {description && (
        <Box marginBottom={4}>
          <Text>{formatText(description, application, formatMessage)}</Text>
        </Box>
      )}
      {mappedExisting && (
        <Box marginBottom={2}>
          <ApplicationList
            applications={mappedExisting}
            onClick={(url) => {
              setContinueConf({ url: url, action: ACTION.EXISTING })
            }}
          />
        </Box>
      )}
      {mappedEstates && (
        <Box>
          <ApplicationList
            applications={mappedEstates}
            onClick={(url) => setContinueConf({ url: url, action: ACTION.NEW })}
          />
        </Box>
      )}
    </>
  )
}

export default LinkExistingApplication
