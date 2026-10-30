import type { User } from '@island.is/judicial-system/types'

import { createTestingServiceInterruptionBannerModule } from './createTestingServiceInterruptionBannerModule'

import {
  ServiceInterruptionBanner,
  ServiceInterruptionBannerRepositoryService,
} from '../../repository'
import { UpdateServiceInterruptionBannerDto } from '../dto/updateServiceInterruptionBanner.dto'
import { ServiceInterruptionBannerController } from '../serviceInterruptionBanner.controller'

interface Then {
  result: ServiceInterruptionBanner
  error: Error
}

type GivenWhenThen = (
  user: User,
  update: UpdateServiceInterruptionBannerDto,
) => Promise<Then>

describe('ServiceInterruptionBannerController - Update', () => {
  const user = { nationalId: '1234567890' } as User

  let mockRepository: ServiceInterruptionBannerRepositoryService
  let controller: ServiceInterruptionBannerController
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      serviceInterruptionBannerRepositoryService,
      serviceInterruptionBannerController,
    } = await createTestingServiceInterruptionBannerModule()

    mockRepository = serviceInterruptionBannerRepositoryService
    controller = serviceInterruptionBannerController

    givenWhenThen = async (user, update) => {
      const then = {} as Then

      try {
        then.result = await controller.update(user, update)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('banner updated', () => {
    const update: UpdateServiceInterruptionBannerDto = {
      title: '  Mikilvæg skilaboð  ',
      globalMessage: '  Kerfið er niðri  ',
      prosecutorMessage: '   ',
      courtMessage: undefined,
    }
    const updated = {
      id: 1,
      title: 'Mikilvæg skilaboð',
      globalMessage: 'Kerfið er niðri',
      prosecutorMessage: '',
    } as ServiceInterruptionBanner
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockRepository.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updated)

      then = await givenWhenThen(user, update)
    })

    it('should trim values, stamp the acting user and forward to the repository', () => {
      expect(mockRepository.update).toHaveBeenCalledWith({
        title: 'Mikilvæg skilaboð',
        globalMessage: 'Kerfið er niðri',
        prosecutorMessage: '',
        courtMessage: undefined,
        modifiedBy: user.nationalId,
      })
    })

    it('should return the updated banner', () => {
      expect(then.result).toBe(updated)
    })
  })

  describe('null fields treated as omitted', () => {
    beforeEach(async () => {
      const mockUpdate = mockRepository.update as jest.Mock
      mockUpdate.mockResolvedValueOnce({ id: 1 } as ServiceInterruptionBanner)

      await givenWhenThen(user, {
        title: null as unknown as string,
        globalMessage: '  texti  ',
      })
    })

    it('should not pass null through to the repository', () => {
      expect(mockRepository.update).toHaveBeenCalledWith({
        title: undefined,
        globalMessage: 'texti',
        prosecutorMessage: undefined,
        courtMessage: undefined,
        modifiedBy: user.nationalId,
      })
    })
  })
})
