import React, { FC } from 'react'

import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import {
  FieldBaseProps,
  getValueViaPath,
  formatText,
  Application,
} from '@island.is/application/core'
import { ApplicationList } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import { useHistory } from 'react-router-dom'
import { useDeleteApplication } from './hooks/useDeleteApplication'

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

  if (existing.length < 1) {
    throw new Error('no existing application - should not happen')
  }

  const mapped = existing.map((app) => {
    const name =
      getValueViaPath<Application[]>(app.answers, 'nameOfDeceased') ?? ''
    return {
      ...app,
      name: `${formatText(
        m.applicationTitle,
        application,
        formatMessage,
      )} ${name}`,
    }
  })

  return (
    <>
      {description && (
        <Box marginBottom={4}>
          <Text>{formatText(description, application, formatMessage)}</Text>
        </Box>
      )}
      <Box>
        <ApplicationList
          applications={mapped}
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
