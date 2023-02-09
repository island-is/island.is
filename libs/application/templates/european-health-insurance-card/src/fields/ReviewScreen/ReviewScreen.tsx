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

  console.log('review screen')
  console.log(application.externalData)

  const apply = []
  const applyForTemp = []

  const nationalRegistryData = application.externalData.nationalRegistry
    ?.data as NationalRegistry
  const nationalRegistryDataSpouse = application?.externalData
    ?.nationalRegistrySpouse?.data as NationalRegistry
  const nationalRegistryDataChildren = (application?.externalData
    ?.childrenCustodyInformation as unknown) as NationalRegistry

  const applicant: Person = {
    name: nationalRegistryData?.fullName,
    nationalId: nationalRegistryData.nationalId,
  }

  const spouse: Person = {
    name: nationalRegistryDataSpouse?.name,
    nationalId: nationalRegistryDataSpouse?.nationalId,
  }

  const residence: Address = {
    address: {
      streetAddress: nationalRegistryData.address.streetAddress,
      locality: nationalRegistryData.address.locality,
      municipalityCode: nationalRegistryData.address.municipalityCode,
      postalCode: nationalRegistryData.address.postalCode,
    },
  }

  function getObjectKey(obj: any, value: any) {
    return Object.keys(obj).filter((key) => obj[key] === value)
  }

  const applicants = getObjectKey(answers, true)

  if (applicants.includes(`apply-${applicant?.nationalId}`)) {
    apply.push(applicant)
  }

  if (applicants.includes(`apply-${spouse?.nationalId}`)) {
    apply.push(spouse)
  }

  for (var i = 0; i < nationalRegistryDataChildren.data.length; i++) {
    if (
      applicants.includes(
        `apply-${nationalRegistryDataChildren.data[i].nationalId}`,
      )
    ) {
      apply.push(nationalRegistryDataChildren.data[i])
    }
  }

  if (applicants.includes(`temp-${applicant?.nationalId}`)) {
    applyForTemp.push(applicant)
  }

  if (applicants.includes(`temp-${spouse?.nationalId}`)) {
    applyForTemp.push(spouse)
  }

  for (var i = 0; i < nationalRegistryDataChildren.data.length; i++) {
    if (
      applicants.includes(
        `temp-${nationalRegistryDataChildren.data[i].nationalId}`,
      )
    ) {
      applyForTemp.push(nationalRegistryDataChildren.data[i])
    }
  }

  return (
    <Box marginTop={4}>
      <Stack space={7}>
        <Stack space={3}>
          <Box>
            <Text variant="h5">
              {formatText(
                e.review.sectionPersonsLabel,
                application,
                formatMessage,
              )}
            </Text>

            {apply?.map((item, index) => (
              <Text>{item.name || item.fullName}</Text>
            ))}
          </Box>
          <Divider />
          <Box>
            <Text variant="h5">
              {formatText(
                'Umsækjendur sem vilja fá tímabundið bráðabirgðakort',
                application,
                formatMessage,
              )}
            </Text>

            {applyForTemp?.map((item, index) => (
              <Text>{item.name || item.fullName}</Text>
            ))}
          </Box>
          <Divider />
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
          <Box>
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
