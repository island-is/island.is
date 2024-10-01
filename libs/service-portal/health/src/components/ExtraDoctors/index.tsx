import { RightsPortalMethylDoctor } from '@island.is/api/schema'
import { Box, Text } from '@island.is/island-ui/core'

interface Props {
  doctors?: RightsPortalMethylDoctor[]
}

export const ExtraDoctors = ({ doctors }: Props) => {
  const docs = doctors?.map((doctor) => doctor.name)

  if (!docs || docs.length === 0) {
    return null
  }

  return (
    <Box>
      {docs.map((doc) => (
        <Box>
          <Text translate="no" variant="default">
            {doc}
          </Text>
        </Box>
      ))}
    </Box>
  )
}
