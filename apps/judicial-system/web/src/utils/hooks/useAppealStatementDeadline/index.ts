import type {
  AppealStatementDeadline,
  SetAppealStatementDeadlineInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import { useSetAppealStatementDeadlineMutation } from './setAppealStatementDeadline.generated'

// Gives a party of a verdict appeal its deadline to file a statement, or
// moves the one it has - the backend tells the two apart. Returns the saved
// deadline, or undefined when the request failed and a toast has said so.
const useAppealStatementDeadline = () => {
  const [setAppealStatementDeadlineMutation, { loading }] =
    useSetAppealStatementDeadlineMutation()

  const setAppealStatementDeadline = async (
    input: SetAppealStatementDeadlineInput,
  ): Promise<AppealStatementDeadline | undefined> => {
    try {
      const { data } = await setAppealStatementDeadlineMutation({
        variables: { input },
      })

      return data?.setAppealStatementDeadline ?? undefined
    } catch {
      toast.error('Upp kom villa við að senda greinargerðarfrest')

      return undefined
    }
  }

  return {
    setAppealStatementDeadline,
    isSettingAppealStatementDeadline: loading,
  }
}

export default useAppealStatementDeadline
