import { useCallback } from 'react'
import { gql, useMutation } from '@apollo/client'
import type { Application } from '@island.is/application/types'
import { SyncMethodEnum } from './constants'

export type SyncCommand = {
  method: SyncMethodEnum
  id?: string
  data?: Record<string, unknown>
}

export type SyncBatch = {
  criteria?: SyncCommand[]
  subCriteria?: SyncCommand[]
  steps?: SyncCommand[]
  roles?: SyncCommand[]
  employees?: SyncCommand[]
  outlierGroups?: SyncCommand[]
}

// Custom resolver, not the standard updateApplicationExternalData provider mechanism —
// that only takes {actionId, order}, with no channel for an arbitrary sync-batch payload.
const SYNC_SALARY_REPORT_DRAFT = gql`
  mutation DirectorateOfEqualitySyncSalaryReportDraft(
    $input: DirectorateOfEqualitySyncSalaryReportDraftInput!
  ) {
    directorateOfEqualitySyncSalaryReportDraft(input: $input)
  }
`

// DMR hard-caps employee commands at 1000 per call — chunk rather than fail.
const EMPLOYEE_CHUNK_SIZE = 1000

// Deliberately synchronous-blocking: "Continue" awaits this and refuses to
// navigate on failure — a failed sync means something is genuinely wrong,
// not something to silently retry.
export const useDraftSync = (application: Application) => {
  const [mutate, { loading }] = useMutation(SYNC_SALARY_REPORT_DRAFT)

  const sync = useCallback(
    async (batch: SyncBatch): Promise<void> => {
      const employees = batch.employees ?? []
      if (employees.length <= EMPLOYEE_CHUNK_SIZE) {
        await mutate({
          variables: { input: { applicationId: application.id, ...batch } },
        })
        return
      }

      // First call carries all other collections plus the first employee chunk;
      // later calls carry only employees.
      const { employees: _drop, ...rest } = batch
      for (let i = 0; i < employees.length; i += EMPLOYEE_CHUNK_SIZE) {
        const chunk = employees.slice(i, i + EMPLOYEE_CHUNK_SIZE)
        // eslint-disable-next-line no-await-in-loop
        await mutate({
          variables: {
            input: {
              applicationId: application.id,
              ...(i === 0 ? rest : {}),
              employees: chunk,
            },
          },
        })
      }
    },
    [application.id, mutate],
  )

  return { sync, isSyncing: loading }
}
