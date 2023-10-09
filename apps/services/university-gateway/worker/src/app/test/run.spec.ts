import fetch from 'node-fetch'

import { logger } from '@island.is/logging'

import { now } from '../date.factory'
import { appModuleConfig } from '../app.config'
import { AppService } from '../app.service'

jest.mock('node-fetch')
jest.mock('@island.is/logging')
jest.mock('../date.factory')

interface Then {
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('AppService - Run', () => {
  const mockError = logger.error as jest.Mock
  const mockNow = now as jest.Mock
  const mockFetch = fetch as unknown as jest.Mock
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    mockError.mockClear()
    mockNow.mockClear()
    mockFetch.mockClear()
    mockNow.mockReturnValue(new Date('2020-01-01T00:01:00.000Z'))

    givenWhenThen = async (): Promise<Then> => {
      const appService = new AppService(appModuleConfig())
      const then = {} as Then

      await appService.run().catch((error) => (then.error = error))

      return then
    }
  })

  describe('at least one remote call', () => {
    beforeEach(async () => {
      await givenWhenThen()
    })

    it('should call the backend', () => {
      expect(fetch).toHaveBeenCalledWith(
        `${appModuleConfig().backendUrl}/api/internal/programs/update`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${appModuleConfig().backendAccessToken}`,
          },
        },
      )
    })
  })

  describe('continue until time is up', () => {
    beforeEach(async () => {
      mockNow
        .mockReturnValueOnce(new Date('2020-01-01T00:00:00.000Z'))
        .mockReturnValueOnce(new Date('2020-01-01T00:00:00.000Z'))
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ caseArchived: true }),
      })

      await givenWhenThen()
    })

    it('should call the backend twice', () => {
      expect(fetch).toHaveBeenCalledTimes(2)
    })
  })
})
