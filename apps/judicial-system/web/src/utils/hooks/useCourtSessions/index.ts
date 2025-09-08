import { useCallback } from 'react'

import { toast } from '@island.is/island-ui/core'
import { UpdateCourtSessionInput } from '@island.is/judicial-system-web/src/graphql/schema'

import { useUpdateCourtSessionMutation } from './updateCourtSession.generated'

const useCourtSessions = () => {
  const [updateCourtSessionMutation] = useUpdateCourtSessionMutation()

  const updateCourtSession = useCallback(
    async (updateCourtSession: UpdateCourtSessionInput) => {
      try {
        const { data } = await updateCourtSessionMutation({
          variables: {
            input: updateCourtSession,
          },
        })

        return Boolean(data)
      } catch (error) {
        toast.error('Upp kom villa við að uppfæra þinghald')

        return false
      }
    },
    [],
  )

  return {
    updateCourtSession,
  }
}

export default useCourtSessions
