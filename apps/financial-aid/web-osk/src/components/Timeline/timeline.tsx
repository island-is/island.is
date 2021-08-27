import React from 'react'
import { Text, FormStepper, Box } from '@island.is/island-ui/core'

import { useRouter } from 'next/router'
import {
  ApplicationEvent,
  ApplicationState,
  getActiveSectionForTimeline,
} from '@island.is/financial-aid/shared'
import { GetApplicationEventQuery } from '@island.is/financial-aid-web/oskgraphql'
import { useQuery } from '@apollo/client'

interface Props {
  state: ApplicationState
}

interface ApplicationEventData {
  applicationEvents: ApplicationEvent[]
}

const Timeline = ({ state }: Props) => {
  const router = useRouter()

  //Todo bæta við subsection
  const { data, loading } = useQuery<ApplicationEventData>(
    GetApplicationEventQuery,
    {
      variables: { input: { id: router.query.id } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

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
    <Box marginBottom={[4, 4, 7]}>
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
