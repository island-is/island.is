import React, { FC } from 'react'

import { useLocale } from '@island.is/localization'
import {
  ActionCard,
  Box,
  Tag,
  Text,
  TopicCard,
} from '@island.is/island-ui/core'
import { getValueViaPath, formatText } from '@island.is/application/core'
import { FieldBaseProps, Application } from '@island.is/application/types'
import { ApplicationList } from '@island.is/application/ui-components'
import { m } from '../lib/messages'
import { useHistory } from 'react-router-dom'
import { CurrentLicenseProviderResult } from '../dataProviders/CurrentLicenseProvider'

export const CurrentLicense: FC<FieldBaseProps> = ({ application, field }) => {
  const { formatMessage } = useLocale()
  const { description } = field

  const currentLicense =
    getValueViaPath<CurrentLicenseProviderResult>(
      application.externalData,
      'currentLicense.data',
    ) ?? null

  if (!currentLicense || !currentLicense.categories) {
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
        {currentLicense.categories.map((category) => (
          <Box
            display="flex"
            flexDirection="column"
            borderColor="blue200"
            borderRadius="large"
            borderWidth="standard"
            paddingX={[3, 3, 4]}
            paddingY={3}
          >
            <Box
              alignItems={['flexStart', 'center']}
              display="flex"
              flexDirection={['column', 'row']}
            >
              <Box flexDirection="row" width="full">
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="spaceBetween"
                  alignItems={['flexStart', 'flexStart', 'flexEnd']}
                >
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <Text variant="h4">{category.name}</Text>
                  </Box>
                </Box>

                <Text paddingTop={1}> {category.name}</Text>
              </Box>

              <Box
                display="flex"
                alignItems={['flexStart', 'flexEnd']}
                flexDirection="column"
                flexShrink={0}
                marginTop={[1, 0]}
                marginLeft={[0, 'auto']}
              >
                <Tag>{category.expires}</Tag>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  )
}

export default CurrentLicense
