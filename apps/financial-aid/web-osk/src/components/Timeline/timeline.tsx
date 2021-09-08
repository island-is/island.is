import React from 'react'
import { Text, FormStepper, Box } from '@island.is/island-ui/core'

import {
  ApplicationState,
  getActiveSectionForTimeline,
} from '@island.is/financial-aid/shared/lib'

interface Props {
  state: ApplicationState
}

const Timeline = ({ state }: Props) => {
  const sections = [
    {
      name: 'Umsókn móttekin',
    },
    {
      name: 'Umsókn í vinnslu',
    },
    {
      name: 'Niðurstaða',
    },
  ]

  return (
    <Box marginY={[4, 4, 5]}>
      <Text as="h3" variant="h3" marginBottom={[1, 1, 2]}>
        Umsóknarferlið
      </Text>
      <Text marginBottom={1}>
        Hér geturðu séð hvað hefur gerst og hvað er framundan. Hikaðu ekki við
        að senda okkur athugasemd ef þú telur eitthvað óljóst eða rangt.
      </Text>

      <FormStepper
        activeSection={getActiveSectionForTimeline[state]}
        sections={sections}
      />
    </Box>
  )
}

export default Timeline
