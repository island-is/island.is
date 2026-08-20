import { useMutation } from '@apollo/client'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import template from '../lib/template'

// TEMPORARY — for locally testing state transitions. Delete before committing.
export const DebugEventButtons = ({ application, refetch }: FieldBaseProps) => {
  const { lang: locale } = useLocale()
  const [submitApplication, { loading }] = useMutation(SUBMIT_APPLICATION)

  const events = Object.keys(
    template.stateMachineConfig.states?.[application.state]?.on ?? {},
  )

  if (events.length === 0) {
    return (
      <Box border="standard" borderColor="red400" borderRadius="large" padding={3}>
        <Text variant="eyebrow" color="red600">
          DEBUG
        </Text>
        <Text>No outgoing events from state &quot;{application.state}&quot;.</Text>
      </Box>
    )
  }

  return (
    <Box border="standard" borderColor="red400" borderRadius="large" padding={3}>
      <Text variant="eyebrow" color="red600" marginBottom={2}>
        DEBUG — current state: {application.state}
      </Text>
      <Box display="flex" flexWrap="wrap" style={{ gap: 8 }}>
        {events.map((event) => (
          <Button
            key={event}
            size="small"
            variant="ghost"
            colorScheme="negative"
            loading={loading}
            onClick={async () => {
              await submitApplication({
                variables: {
                  input: { id: application.id, event },
                  locale,
                },
              })
              refetch?.()
            }}
          >
            {event}
          </Button>
        ))}
      </Box>
    </Box>
  )
}

export default DebugEventButtons
