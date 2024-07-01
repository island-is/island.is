import { FormSystemDocumentType, Maybe } from "@island.is/api/schema"
import { Box, Checkbox, Icon, Stack, Text } from "@island.is/island-ui/core"
import { useIntl } from "react-intl"
import { m } from "../../lib/messages"


interface Props {
  documents?: Maybe<FormSystemDocumentType>[] | null
}

export const PremisesPreview = ({ documents }: Props) => {
  const { formatMessage } = useIntl()
  return (
    <Box
      display="flex"
      flexDirection="column"
    >
      <Stack space={2}>
        <Text variant="h2">{formatMessage(m.dataFetch)}</Text>
        <Box
          display="flex"
          flexDirection="row"
        >
          <Box marginRight={1}>
            <Icon icon="fileTrayFull" />
          </Box>
          <Text
            fontWeight="semiBold"
          >
            {formatMessage(m.personalInfoFetch)}
          </Text>
        </Box>
      </Stack>
      <Box marginTop={4}>
        <Stack space={3}>
          <Box display="flex" flexDirection="column">
            <Text fontWeight="semiBold" color="blue600">{formatMessage(m.myData)}</Text>
            <Text>{formatMessage(m.myDataDescription)}</Text>
          </Box>
          {documents?.map(d => (
            <Box display="flex" flexDirection="column">
              <Text fontWeight="semiBold" color="blue600">{d?.name?.is}</Text>
              <Text>Upplýsingar um {d?.description?.is?.toLowerCase()}</Text>
            </Box>
          ))}
          <Box
            background="white"
          >
            <Checkbox
              label="Ég skil að ofangreindra gagna verður aflað í umsóknarferlinu"
              large
              backgroundColor="white"
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}
