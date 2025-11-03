import { Address, Answer, NationalRegistry } from '../../lib/types'
import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'

import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { europeanHealthInsuranceCardApplicationMessages as e } from '../../lib/messages'
import { formatText } from '@island.is/application/core'
import { getFullName } from '../../lib/helpers/applicantHelper'
import { useLocale } from '@island.is/localization'

const ReviewScreen: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()

  const nationalRegistryData = application.externalData.nationalRegistry
    ?.data as NationalRegistry

  const residence: Address = {
    streetAddress: nationalRegistryData.address.streetAddress,
    locality: nationalRegistryData.address.locality,
    municipalityCode: nationalRegistryData.address.municipalityCode,
    postalCode: nationalRegistryData.address.postalCode,
  }

  const answers = application.answers as unknown as Answer
  const plastic = answers.delimitations.applyForPlastic
  const pdf = application.answers.applyForPDF as Array<string>
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

                {plastic?.map((item) => (
                  <Text key={item}>{getFullName(application, item)}</Text>
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
                    e.review.sectionPersonsWhoWantPDFLabel,
                    application,
                    formatMessage,
                  )}
                </Text>

                {pdf?.map((item) => (
                  <Text key={item}>{getFullName(application, item)}</Text>
                ))}
              </Box>
              <Divider />
              <Box>
                <Text variant="h5">
                  {formatText(
                    e.review.sectionPDFDeliveryTitle,
                    application,
                    formatMessage,
                  )}
                </Text>
                <Text>
                  {formatText(
                    e.review.sectionPDFDeliveryDescription,
                    application,
                    formatMessage,
                  )}
                </Text>
              </Box>
              <Divider />
            </>
          )}
          {plastic?.length > 0 && (
            <>
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
                  {residence.streetAddress}, {residence.postalCode}{' '}
                  {residence.locality}
                </Text>
              </Box>
            </>
          )}
          {application?.state === 'approved' && <Box marginBottom={8} />}
        </Stack>
      </Stack>
    </Box>
  )
}
export default ReviewScreen
