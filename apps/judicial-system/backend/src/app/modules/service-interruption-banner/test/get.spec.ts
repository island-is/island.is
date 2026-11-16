import { NotFoundException } from '@nestjs/common'

import { createTestingServiceInterruptionBannerModule } from './createTestingServiceInterruptionBannerModule'

import {
  ServiceInterruptionBanner,
  ServiceInterruptionBannerRepositoryService,
} from '../../repository'
import { ServiceInterruptionBannerController } from '../serviceInterruptionBanner.controller'

interface Then {
  result: ServiceInterruptionBanner
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('ServiceInterruptionBannerController - Get', () => {
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

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        then.result = await controller.get()
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('banner found', () => {
    const banner = {
      id: 1,
      title: 'Mikilvæg skilaboð',
      globalMessage: '',
    } as ServiceInterruptionBanner
    let then: Then

    beforeEach(async () => {
      const mockFind = mockRepository.find as jest.Mock
      mockFind.mockResolvedValueOnce(banner)

      then = await givenWhenThen()
    })

    it('should request the banner from the repository', () => {
      expect(mockRepository.find).toHaveBeenCalled()
    })

    it('should return the banner', () => {
      expect(then.result).toBe(banner)
    })
  })

  describe('banner not found', () => {
    let then: Then

    beforeEach(async () => {
      const mockFind = mockRepository.find as jest.Mock
      mockFind.mockResolvedValueOnce(null)

      then = await givenWhenThen()
    })

    it('should respond with not found', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe('Service interruption banner not found')
    })
  })
})
