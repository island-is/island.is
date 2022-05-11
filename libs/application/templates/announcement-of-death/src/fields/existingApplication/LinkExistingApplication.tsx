import React, { FC, useCallback, useEffect, useState } from 'react'

import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import {
  FieldBaseProps,
  getValueViaPath,
  formatText,
  Application,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/core'
import { ApplicationList } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import { useHistory } from 'react-router-dom'
import { useDeleteApplication } from './hooks/useDeleteApplication'
import { EstateRegistrant } from '@island.is/clients/syslumenn'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'

enum ACTION {
  EXISTING = 'existing',
  NEW = 'new',
}
interface IContinueConf {
  url: string
  action: ACTION
}

export const LinkExistingApplication: FC<FieldBaseProps> = ({
  application,
  field,
  refetch,
  goToScreen,
}) => {
  const { locale, formatMessage } = useLocale()
  const { description } = field
  const history = useHistory()
  const [continueConf, setContinueConf] = useState<IContinueConf>()
  const [updateApplication, { loading }] = useMutation(UPDATE_APPLICATION)

  const { deleteApplication, loading: deleteLoading } = useDeleteApplication()

  const changeScreens = (screen: string) => {
    if (goToScreen) goToScreen(screen)
  }

  const assignEstateToAnswers = useCallback(async (estate) => {
    if (estate) {
      const res = await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: {
              ...application.answers,
              ...estate,
            },
          },
          locale,
        },
      })
      if (!res.data && refetch) {
        refetch()
      }
    }
  }, [])

  const getNewEstateFromUrl = (url: string) => {
    const caseNumber = url.split('/').pop()
    return estates.find((estate) => estate.caseNumber == caseNumber)
  }

  useEffect(() => {
    const handleContinue = async () => {
      if (continueConf) {
        switch (continueConf.action) {
          case ACTION.EXISTING:
            // delete current application
            await deleteApplication(application.id)
            if (!deleteLoading) {
              // push to existing application
              history.push(`../../${continueConf.url}`)
            }
            break
          case ACTION.NEW:
            // get estate from casenumber in url
            const estate = getNewEstateFromUrl(continueConf.url)
            // update answers with estate
            await assignEstateToAnswers(estate)
            // continue to next screen
            if (!loading) {
              changeScreens('list')
            }
            break
          default:
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

  const estates =
    getValueViaPath<EstateRegistrant[]>(
      application.externalData,
      'syslumennOnEntry.data.estates',
      [],
    ) ?? []

  var caseNumbers: string[] = []

  const mappedExisting = existing.map((app) => {
    const name =
      getValueViaPath<Application[]>(app.answers, 'nameOfDeceased') ?? ''
    caseNumbers[caseNumbers.length] =
      getValueViaPath<Application[]>(app.answers, 'caseNumber')?.toString() ??
      ''
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
