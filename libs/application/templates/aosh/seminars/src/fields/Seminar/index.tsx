import { Box, Text } from '@island.is/island-ui/core'
import { seminar as seminarMessages } from '../../lib/messages/seminar'
import { useLocale } from '@island.is/localization'

export const Seminar = () => {
  const mockSeminar = {
    type: 'Stafrænt ADR-endurnýjun. Grunnámskeið.',
    price: '32.100 kr.',
    begins: 'Við skráningu',
    ends: 'Er opið í 8 vikur frá skráningu',
    descriptionLink: 'https://www.mbl.is',
    description: 'Sjá námskeiðislýsingu hér',
    location: 'Fræðslukerfi Vinnueftirlitisins (á netinu)',
  }

  const { formatMessage } = useLocale()

  return (
    <Box
      border="standard"
      borderColor="blue200"
      borderWidth="standard"
      padding={3}
    >
      <Box display="flex">
        <Text fontWeight="semiBold">
          {formatMessage(seminarMessages.labels.seminarType)}
        </Text>
        <Text>{mockSeminar.type}</Text>
      </Box>
      <Box display="flex">
        <Text fontWeight="semiBold">
          {formatMessage(seminarMessages.labels.seminarPrice)}
        </Text>
        <Text>{mockSeminar.price}</Text>
      </Box>
      <Box display="flex">
        <Text fontWeight="semiBold">
          {formatMessage(seminarMessages.labels.seminarBegins)}
        </Text>
        <Text>{mockSeminar.begins}</Text>
      </Box>
      <Box display="flex">
        <Text fontWeight="semiBold">
          {formatMessage(seminarMessages.labels.seminarEnds)}
        </Text>
        <Text>{mockSeminar.ends}</Text>
      </Box>
      <Box display="flex">
        <Text fontWeight="semiBold">
          {formatMessage(seminarMessages.labels.seminarDescription)}
        </Text>
        <Text>{mockSeminar.description}</Text>
      </Box>
      <Box display="flex">
        <Text fontWeight="semiBold">
          {formatMessage(seminarMessages.labels.seminarLocation)}
        </Text>
        <Text>{mockSeminar.location}</Text>
      </Box>
    </Box>
  )
}
