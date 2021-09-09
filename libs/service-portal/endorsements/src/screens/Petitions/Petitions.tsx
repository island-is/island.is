import React from 'react'
import { Box, Text, ActionCard, Stack } from '@island.is/island-ui/core'

const Petitions = () => {
  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={2}>
        <Text variant="h1" as="h1">
          {'Undirskriftalistar'}
        </Text>

        <Text as="p" variant="intro">
          {'texti hér hahahaha lalalala okok fallegt'}
        </Text>
      </Stack>

      <Box marginTop={4}>
        <Stack space={4}>
          <ActionCard
            key={'Title'}
            backgroundColor="blue"
            heading={'Description'}
            text={'text'}
            cta={{
              label: 'Nánar um lista',
              variant: 'text',
              icon: 'arrowForward',
              //onClick: () =>
                //router.push('/undirskriftalistar/' + 1),
            }}
          />
          <ActionCard
            key={'Title'}
            backgroundColor="blue"
            heading={'Description'}
            text={'text'}
            cta={{
              label: 'Nánar um lista',
              variant: 'text',
              icon: 'arrowForward',
            }}
          />
        </Stack>
      </Box>
    </Box>
  )
}

export default Petitions
