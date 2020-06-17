import { ApplicationStates as IApplicationStates } from '@island.is/gjafakort/types'

export const ApplicationTypes = {
  GJAFAKORT_COMPANY: 'gjafakort',
  GJAFAKORT_USER: 'gjafakort-user',
}

export const ApplicationStates = {
  PENDING: 'pending',
  APPROVED: 'approved',
  MANUAL_APPROVED: 'manual-approved',
  REJECTED: 'rejected',
  NONE: 'none',
} as IApplicationStates
