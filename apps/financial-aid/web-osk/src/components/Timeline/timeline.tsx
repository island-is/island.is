import React from 'react'
import { Text, FormStepper, Box } from '@island.is/island-ui/core'

import {
  ApplicationState,
  getActiveSectionForTimeline,
} from '@island.is/financial-aid/shared/lib'
import format from 'date-fns/format'

interface Props {
  state: ApplicationState
  created: string
}

const Timeline = ({ state, created }: Props) => {
  const sections = [
    {
      name: 'Umsókn móttekin',
      children: [
        {
          type: 'SUB_SECTION',
          name: format(new Date(created), 'dd/MM/yyyy hh:mm'),
        },
      ],
    },
    {
      name: 'Umsókn í vinnslu',
      children: [
        {
          type: 'SUB_SECTION',
          name:
            'Vinnsluaðili verður í sambandi ef þörf er á frekari upplýsingum',
        },
      ],
    },
    {
      name: 'Niðurstaða',
      children: [
        {
          type: 'SUB_SECTION',
          name:
            'Umsókn verður samþykkt eða synjuð og umsækjandi látinn vita um niðurstöðuna',
        },
      ],
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
