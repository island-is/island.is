import { useCallback } from 'react'

import { CreateEventLogInput } from '@island.is/judicial-system-web/src/graphql/schema'

import { useCreateEventLogMutation } from './createEventLog.generated'

const useEventLog = () => {
  const [createEventLogMutation] = useCreateEventLogMutation()

  const createEventLog = useCallback(
    async (eventLog: CreateEventLogInput) => {
      try {
        const { data } = await createEventLogMutation({
          variables: {
            input: eventLog,
          },
        })

        if (data) {
          return data.createEventLog
        }
      } catch (error) {
        console.error(error)
      }
    },
    [createEventLogMutation],
  )

  return { createEventLog }
}
export default useEventLog
