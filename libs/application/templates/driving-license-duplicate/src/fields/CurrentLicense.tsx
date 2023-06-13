import React, { FC } from 'react'

import { useLocale } from '@island.is/localization'
import { Box, Tag, Text } from '@island.is/island-ui/core'
import { getValueViaPath, formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import format from 'date-fns/format'
import { m } from '../lib/messages'
import { getApplicationInfo } from '../lib/utils'

export const CurrentLicense: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const fakeLicense = getValueViaPath<string>(
    application.answers,
    'fakeData.currentLicense',
  )

  let currentLicense =
    getValueViaPath<any>(application.externalData, 'currentLicense.data') ??
    null

  if (!currentLicense || !currentLicense.categories) {
    if (!fakeLicense) {
      throw new Error('no existing license - should not happen')
    }
    currentLicense = {
      categories: [
        {
          name: fakeLicense,
          expires: '2065-04-04',
        },
      ],
    }
  }

  return (
    <>
      <Box marginBottom={3} marginTop={4}>
        <Text variant="h3">
          {formatText(m.rights, application, formatMessage)}
        </Text>
      </Box>
      <Box marginBottom={4}>
        {currentLicense.categories.map(
          (
            category: {
              expires: string | number | Date
              name: string
              nr: string
            },
            index: number,
          ) => {
            const expires =
              formatMessage(m.validTag) +
              ' ' +
              format(new Date(category.expires), 'dd.MM.yyyy')
            return (
              <Box
                key={category.name + JSON.stringify(index)}
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
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                      >
                        <Text variant="h3">
                          {`${category.nr} - ${formatText(
                            m.categorySectionTitle,
                            application,
                            formatMessage,
                          )}`}
                        </Text>
                      </Box>
                    </Box>
                    <Text paddingTop={1}>{category.name}</Text>
                  </Box>
                  <Box
                    display="flex"
                    alignItems={['flexStart', 'flexEnd']}
                    flexDirection="column"
                    flexShrink={0}
                    marginTop={[1, 0]}
                    marginLeft={[0, 'auto']}
                  >
                    <Tag disabled={true}>{expires}</Tag>
                  </Box>
                </Box>
              </Box>
            )
          },
        )}
      </Box>
    </>
  )
}

export default CurrentLicense
