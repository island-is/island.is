import { Address, NationalRegistry, Person } from '../../lib/types'
import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'

import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { europeanHealthInsuranceCardApplicationMessages as e } from '../../lib/messages'
import { formatText } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'

const ReviewScreen: FC<FieldBaseProps> = ({ application }) => {
  const { answers } = application
  const { formatMessage } = useLocale()

  const nationalRegistryData = application.externalData.nationalRegistry
    ?.data as NationalRegistry

  const residence: Address = {
    address: {
      streetAddress: nationalRegistryData.address.streetAddress,
      locality: nationalRegistryData.address.locality,
      municipalityCode: nationalRegistryData.address.municipalityCode,
      postalCode: nationalRegistryData.address.postalCode,
    },
  }

  const plastic = application.answers.applyForPlastic as Array<any>
  const pdf = application.answers.applyForPDF as Array<any>

  console.log(application)

  return (
    <Box marginTop={4}>
      <Stack space={7}>
        <Stack space={3}>
          {plastic?.length > 0 && (
            <>
              <Box>
                <Text variant="h5">
                  {formatText(
                    e.review.sectionPersonsLabel,
                    application,
                    formatMessage,
                  )}
                </Text>

                {plastic?.map((item, index) => (
                  <Text>{item[1]}</Text>
                ))}
              </Box>
              <Divider />
            </>
          )}
          {pdf?.length > 0 && (
            <>
              <Box>
                <Text variant="h5">
                  {formatText(
                    'Umsækjendur sem vilja fá tímabundið bráðabirgðakort',
                    application,
                    formatMessage,
                  )}
                </Text>

                {pdf?.map((item, index) => (
                  <Text>{item[1]}</Text>
                ))}
              </Box>
              <Divider />
            </>
          )}
          <Box>
            <Text variant="h5">
              {formatText(
                e.review.sectionDeliveryLabel,
                application,
                formatMessage,
              )}
            </Text>
            <Text>
              {formatText(
                e.review.sectionDeliveryDescription,
                application,
                formatMessage,
              )}
            </Text>
          </Box>
          <Divider />
          <Box paddingBottom={8}>
            <Text variant="h5">
              {formatText(
                e.review.sectionAddressLabel,
                application,
                formatMessage,
              )}
            </Text>
            <Text>
              {residence.address.streetAddress}, {residence.address.postalCode}{' '}
              {residence.address.locality}
            </Text>
          </Box>
          {application?.state === 'approved' && <Box marginBottom={8} />}
        </Stack>
      </Stack>
    </Box>
  )
}
export default ReviewScreen
