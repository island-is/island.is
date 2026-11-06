import type {
  AppealEventLog,
  AppealStatementDeadline,
  FileAppealStatementInput,
  SetAppealStatementDeadlineInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import { useFileAppealStatementMutation } from './fileAppealStatement.generated'
import { useSetAppealStatementDeadlineMutation } from './setAppealStatementDeadline.generated'

// The court's side of a party's statement in a verdict appeal: gives the
// party its deadline, or moves the one it has - the backend tells the two
// apart - and files the statement on the party's behalf once the court has
// uploaded it. Each returns what was saved, or undefined when the request
// failed and a toast has said so.
const useAppealStatementDeadline = () => {
  const [setAppealStatementDeadlineMutation, { loading: isSetting }] =
    useSetAppealStatementDeadlineMutation()
  const [fileAppealStatementMutation, { loading: isFiling }] =
    useFileAppealStatementMutation()

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

  const fileAppealStatement = async (
    input: FileAppealStatementInput,
  ): Promise<AppealEventLog | undefined> => {
    try {
      const { data } = await fileAppealStatementMutation({
        variables: { input },
      })

      return data?.fileAppealStatement ?? undefined
    } catch {
      toast.error('Upp kom villa við að skrá greinargerð')

      return undefined
    }
  }

  return {
    setAppealStatementDeadline,
    isSettingAppealStatementDeadline: isSetting,
    fileAppealStatement,
    isFilingAppealStatement: isFiling,
  }
}

export default useAppealStatementDeadline
