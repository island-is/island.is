import React, { FC } from 'react'

import { useLocale } from '@island.is/localization'
import { ActionCard, Box, Stack, Text } from '@island.is/island-ui/core'
import {
  FieldBaseProps,
  getValueViaPath,
  formatText,
  Application,
  coreMessages,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/core'
import { ApplicationList } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import { useHistory } from 'react-router-dom'
import { useDeleteApplication } from './hooks/useDeleteApplication'
import { EstateRegistrant } from '@island.is/clients/syslumenn'



export const LinkExistingApplication: FC<FieldBaseProps> = ({
  application,
  field,
}) => {
  const { formatMessage } = useLocale()
  const { description } = field
  const history = useHistory()

  const { deleteApplication } = useDeleteApplication()

  const handleDeleteApplication = (applicationId: string) => {
    deleteApplication(applicationId)
  }

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

  if (existing.length < 1) {
    throw new Error('no existing application - should not happen')
  }
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
//  Pick<Application, 'actionCard' | 'id' | 'typeId' | 'status' |'modified' | 'name' | 'progress'>[]
  const mappedEstates = estates.filter((estate) => !caseNumbers.includes(estate.caseNumber)).map((estate) => {
    return {
      id: estate.caseNumber,
      state: ApplicationStatus.NOT_STARTED,
      actionCard: {
        title: estate.nameOfDeceased
        
      },
      typeId: ApplicationTypes.ANNOUNCEMENT_OF_DEATH,
      modified: new Date(),
      name: estate.nameOfDeceased,
      progress: 0,
      status: ApplicationStatus.NOT_STARTED
    }
  })

  return (
    <>
      {description && (
        <Box marginBottom={4}>
          <Text>{formatText(description, application, formatMessage)}</Text>
        </Box>
      )}
      <Box marginBottom={2}>
        <ApplicationList
          applications={mappedExisting}
          onClick={(url) => {
            handleDeleteApplication(application.id)
            history.push(`../../${url}`)
          }}
        />
        </Box>
        <Box>
         <ApplicationList
          applications={mappedEstates}
          onClick={(url) => {
            handleDeleteApplication(application.id)
            history.push(`../../${url}`)
          }}
        />
    
      </Box>
    </>
  )
}

export default LinkExistingApplication
