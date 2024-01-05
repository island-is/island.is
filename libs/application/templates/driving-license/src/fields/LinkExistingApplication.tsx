import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { getValueViaPath, formatText } from '@island.is/application/core'
import { FieldBaseProps, Application } from '@island.is/application/types'
import { ApplicationList } from '@island.is/application/ui-components'
import { m } from '../lib/messages'

export const LinkExistingApplication: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, field }) => {
  const { formatMessage } = useLocale()
  const { description } = field
  const navigate = useNavigate()

  const existing =
    getValueViaPath<Application[]>(
      application.externalData,
      'existingApplication.data',
    ) ?? []

  if (existing.length < 1) {
    throw new Error('no existing application - should not happen')
  }

  return (
    <>
      {description && (
        <Box marginBottom={4}>
          <Text>{formatText(description, application, formatMessage)}</Text>
        </Box>
      )}
      <Box>
        <ApplicationList
          applications={existing.map((app) => ({
            ...app,
            name: formatText(
              m.applicationForDrivingLicense,
              application,
              formatMessage,
            ),
          }))}
          onClick={(url) => navigate(`../../${url}`)}
        />
      </Box>
    </>
  )
}

export default LinkExistingApplication
