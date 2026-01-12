import React, { FC } from 'react'

import { useLocale } from '@island.is/localization'
import { Box, Tag, Text } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { DriversLicenseCategory } from '@island.is/clients/driving-license'
import format from 'date-fns/format'
import { m } from '../lib/messages'

export const CurrentLicense: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()

  const fakeLicense = getValueViaPath<string>(
    application.answers,
    'fakeData.currentLicense',
  )

  let currentLicense =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getValueViaPath<any>(application.externalData, 'currentLicense.data') ??
    null

  if (!currentLicense || !currentLicense.categories) {
    if (!fakeLicense) {
      throw new Error('no existing license - should not happen')
    }
    currentLicense = {
      categories: [
        {
          name: 'Fólksbifreið / Sendibifreið',
          nr: fakeLicense.split('-')[0],
          expires: '2065-04-04',
          validToCode: fakeLicense === 'B-temp' ? 8 : 1,
        },
      ],
    }
  }

  return (
    <Box marginTop={4}>
      <Text variant="h4" marginBottom={2}>
        {formatMessage(m.rights)}
      </Text>
      <Box>
        {currentLicense.categories.map(
          (category: DriversLicenseCategory, index: number) => {
            const expiresText = category.expires
              ? format(new Date(category.expires), 'dd.MM.yyyy')
              : formatMessage(m.noExpirationDate)
            const expires = `${formatMessage(m.validTag)} ${expiresText}`
            const isTemporary = category.validToCode === 8
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
                marginY={2}
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
                          {`${category.nr} - ${
                            isTemporary
                              ? formatMessage(m.temporaryLicense)
                              : formatMessage(m.generalLicense)
                          }`}
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
    </Box>
  )
}

export default CurrentLicense
