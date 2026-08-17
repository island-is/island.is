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

// Calls the custom resolver added specifically for this migration
// (libs/api/domains/directorate-of-equality-application) — the standard
// `updateApplicationExternalData` provider mechanism has no channel for an
// arbitrary, per-screen frontend-computed payload like a sync batch, only
// `{actionId, order}`, so this bypasses it entirely.
const SYNC_SALARY_REPORT_DRAFT = gql`
  mutation DirectorateOfEqualitySyncSalaryReportDraft(
    $input: DirectorateOfEqualitySyncSalaryReportDraftInput!
  ) {
    directorateOfEqualitySyncSalaryReportDraft(input: $input)
  }
`

// DMR hard-caps employee commands at 1000 per call — chunk rather than fail.
const EMPLOYEE_CHUNK_SIZE = 1000

// Sync is deliberately synchronous-blocking: a screen's "Continue" must
// await this and refuse to navigate on failure/rejection, per the agreed
// save model — a failed sync means something is actually wrong with the
// draft, not something to silently retry in the background.
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

      // First call carries every other collection plus the first employee
      // chunk; subsequent calls carry only the remaining employee chunks.
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
