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
import { m } from '../lib/messages'
import { useHistory } from 'react-router-dom'

export const LinkExistingApplication: FC<FieldBaseProps> = ({
  application,
  field,
}) => {
  const { formatMessage } = useLocale()
  const { description } = field
  const history = useHistory()

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
          onClick={(url) => history.push(`../../${url}`)}
          onDeleteApplication={() => {
            console.log('delete')
          }}
        />
      </Box>
    </>
  )
}

export default LinkExistingApplication
