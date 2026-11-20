import type { Logger } from '@island.is/logging'
import type { ApplicationService } from '@island.is/application/api/core'
import type { ParentalLeaveApi, PregnancyApi } from '@island.is/clients/vmst'
import addMonths from 'date-fns/addMonths'
import format from 'date-fns/format'
import startOfDay from 'date-fns/startOfDay'
import { ChildrenService } from './children.service'
import { MockPregnancyApi } from './mock-pregnancy.api'

describe('MockPregnancyApi', () => {
  const api = new MockPregnancyApi()

  it('returns the mocked pregnancy for a known test user', async () => {
    const result = await api.pregnancyGetPregnancyStatus({
      nationalRegistryId: '0101303019',
    })

    expect(result).toEqual({
      hasActivePregnancy: true,
      pregnancyDueDate: addMonths(startOfDay(new Date()), 4),
      hasError: false,
      errorCode: 0,
      errorMessage: null,
    })
  })

  it('returns a random active pregnancy for unknown users', async () => {
    const result = await api.pregnancyGetPregnancyStatus({
      nationalRegistryId: '1234567890',
    })

    expect(result.hasActivePregnancy).toBe(true)
    expect(result.pregnancyDueDate).toBeInstanceOf(Date)
  })
})

describe('ChildrenService.getPregnancyStatus with MockPregnancyApi', () => {
  const logger = { error: jest.fn() } as unknown as Logger
  const realPregnancyApi = {
    pregnancyGetPregnancyStatus: jest.fn(),
  } as unknown as PregnancyApi

  const service = new ChildrenService(
    logger,
    {} as ApplicationService,
    {} as ParentalLeaveApi,
    realPregnancyApi,
    new MockPregnancyApi(),
  )

  it('maps a mocked active pregnancy without calling VMST', async () => {
    const result = await service.getPregnancyStatus('0101307789')

    expect(result).toEqual({
      hasActivePregnancy: true,
      expectedDateOfBirth: format(
        addMonths(startOfDay(new Date()), 1),
        'yyyy-MM-dd',
      ),
    })
    expect(realPregnancyApi.pregnancyGetPregnancyStatus).not.toHaveBeenCalled()
  })

  it('returns null when the mocked user has no active pregnancy', async () => {
    expect(await service.getPregnancyStatus('0101302399')).toBeNull()
  })

  it('returns null when the mocked VMST response has an error', async () => {
    expect(await service.getPregnancyStatus('0101302129')).toBeNull()
    expect(logger.error).toHaveBeenCalled()
  })
})
