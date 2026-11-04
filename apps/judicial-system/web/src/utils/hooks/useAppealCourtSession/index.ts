import type {
  AppealCourtSession,
  CreateAppealCourtSessionInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import { useCreateAppealCourtSessionMutation } from './createAppealCourtSession.generated'

// Books a session in a verdict appeal at the court of appeals. Returns the
// saved session, or undefined when the request failed and a toast has said so.
const useAppealCourtSession = () => {
  const [createAppealCourtSessionMutation, { loading }] =
    useCreateAppealCourtSessionMutation()

  const createAppealCourtSession = async (
    input: CreateAppealCourtSessionInput,
  ): Promise<AppealCourtSession | undefined> => {
    try {
      const { data } = await createAppealCourtSessionMutation({
        variables: { input },
      })

      return data?.createAppealCourtSession ?? undefined
    } catch {
      toast.error('Upp kom villa við að boða til þinghalds')

      return undefined
    }
  }

  return {
    createAppealCourtSession,
    isCreatingAppealCourtSession: loading,
  }
}

export default useAppealCourtSession
