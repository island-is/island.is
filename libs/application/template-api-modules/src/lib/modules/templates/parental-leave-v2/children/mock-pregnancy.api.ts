import { Injectable } from '@nestjs/common'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import startOfDay from 'date-fns/startOfDay'
import type {
  PregnancyApi,
  PregnancyGetPregnancyStatusRequest,
  PregnancyStatus,
} from '@island.is/clients/vmst'

/**
 * Fake pregnancies for test users, keyed by national id.
 * Returned in the same shape as VMST's `GET /users/{nationalRegistryId}/pregnancy-status`.
 * Due dates are relative to today so they never go stale.
 */
const getMockPregnancies = (): Record<string, PregnancyStatus> => {
  const today = startOfDay(new Date())

  return {
    // Gervimaður Evrópa: active pregnancy, due in ~5 months
    '0101302719': {
      hasActivePregnancy: true,
      pregnancyDueDate: addMonths(today, 5),
      hasError: false,
      errorCode: 0,
      errorMessage: null,
    },
    // Active pregnancy, due in ~4 months
    '0101303019': {
      hasActivePregnancy: true,
      pregnancyDueDate: addMonths(today, 4),
      hasError: false,
      errorCode: 0,
      errorMessage: null,
    },
    // Active pregnancy, due in ~1 month
    '0101307789': {
      hasActivePregnancy: true,
      pregnancyDueDate: addMonths(today, 1),
      hasError: false,
      errorCode: 0,
      errorMessage: null,
    },
    // Active pregnancy, due in ~7 months
    '0101302989': {
      hasActivePregnancy: true,
      pregnancyDueDate: addMonths(today, 7),
      hasError: false,
      errorCode: 0,
      errorMessage: null,
    },
    // No active pregnancy
    '0101302399': {
      hasActivePregnancy: false,
      pregnancyDueDate: null,
      hasError: false,
      errorCode: 0,
      errorMessage: null,
    },
    // VMST error response
    '0101302129': {
      hasActivePregnancy: false,
      pregnancyDueDate: null,
      hasError: true,
      errorCode: 500,
      errorMessage: 'Mocked VMST pregnancy status error',
    },
  }
}

/**
 * Users not in the list above get an active pregnancy with a random due date 6-9 months ahead.
 * VMST only allows one application per due date, so the randomness lets us create many applications per user.
 */
const getRandomPregnancy = (): PregnancyStatus => ({
  hasActivePregnancy: true,
  pregnancyDueDate: addDays(
    addMonths(startOfDay(new Date()), 6),
    Math.ceil(Math.random() * 85),
  ),
  hasError: false,
  errorCode: 0,
  errorMessage: null,
})

/**
 * Stand-in for the VMST PregnancyApi outside of production, since VMST only has a production environment.
 */
@Injectable()
export class MockPregnancyApi
  implements Pick<PregnancyApi, 'pregnancyGetPregnancyStatus'>
{
  async pregnancyGetPregnancyStatus({
    nationalRegistryId,
  }: PregnancyGetPregnancyStatusRequest): Promise<PregnancyStatus> {
    const mockPregnancy = nationalRegistryId
      ? getMockPregnancies()[nationalRegistryId]
      : undefined

    return mockPregnancy ?? getRandomPregnancy()
  }
}
