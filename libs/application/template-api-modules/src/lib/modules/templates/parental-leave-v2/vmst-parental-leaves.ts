import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import type { NewApplication, ParentalLeave } from '@island.is/clients/vmst'

/** The externalData id the VMST leaves are gathered under in prerequisites. */
export const VMST_PARENTAL_LEAVES_ID = 'VMSTParentalLeaves'

/**
 * What VMST holds for the applicant, gathered with the other external data so a
 * follow-up can start without asking VMST again. Kept out of `children`, which
 * the employer can read, and cleared when prerequisites is left.
 */
export interface VmstParentalLeavesData {
  /** VMST's per-applicant list; `null` when it could not be fetched. */
  parentalLeaves: ParentalLeave[] | null
  /** Each listed leave's VMST application, keyed by its VMST application id. */
  applications: Record<string, NewApplication>
}

export const getStoredVmstParentalLeaves = (
  application: Application,
): VmstParentalLeavesData | undefined =>
  getValueViaPath<VmstParentalLeavesData>(
    application.externalData,
    `${VMST_PARENTAL_LEAVES_ID}.data`,
  ) ?? undefined
