import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'

import { errors } from '@island.is/judicial-system-web/messages'
import { CreateEventLogInput } from '@island.is/judicial-system-web/src/graphql/schema'

import { useCreateEventLogMutation } from './createEventLog.generated'

const useEventLog = () => {
  const { formatMessage } = useIntl()
  const [createEventLogMutation] = useCreateEventLogMutation()

  const createEventLog = useCallback(
    async (eventLog: CreateEventLogInput) => {
      try {
        const { data } = await createEventLogMutation({
          variables: {
            input: eventLog,
          },
        })

        return Boolean(data?.createEventLog)
      } catch (error) {
        toast.error(formatMessage(errors.createEventLog))

        return false
      }
    },
    [createEventLogMutation, formatMessage],
  )

  return {
    createEventLog,
  }
}

export default useEventLog
