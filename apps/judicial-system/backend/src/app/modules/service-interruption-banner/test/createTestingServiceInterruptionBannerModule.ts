import { mock } from 'jest-mock-extended'

import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import {
  SharedAuthModule,
  sharedAuthModuleConfig,
} from '@island.is/judicial-system/auth'

import { ServiceInterruptionBannerRepositoryService } from '../../repository'
import { ServiceInterruptionBannerController } from '../serviceInterruptionBanner.controller'
import { ServiceInterruptionBannerService } from '../serviceInterruptionBanner.service'

export const createTestingServiceInterruptionBannerModule = async () => {
  const serviceInterruptionBannerModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [sharedAuthModuleConfig],
      }),
    ],
    controllers: [ServiceInterruptionBannerController],
    providers: [
      SharedAuthModule,
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      ServiceInterruptionBannerService,
    ],
  })
    .useMocker((token) => {
      if (typeof token === 'function') {
        return mock()
      }
    })
    .compile()

  const serviceInterruptionBannerRepositoryService =
    serviceInterruptionBannerModule.get<ServiceInterruptionBannerRepositoryService>(
      ServiceInterruptionBannerRepositoryService,
    )

  const serviceInterruptionBannerService =
    serviceInterruptionBannerModule.get<ServiceInterruptionBannerService>(
      ServiceInterruptionBannerService,
    )

  const serviceInterruptionBannerController =
    serviceInterruptionBannerModule.get<ServiceInterruptionBannerController>(
      ServiceInterruptionBannerController,
    )

  serviceInterruptionBannerModule.close()

  return {
    serviceInterruptionBannerRepositoryService,
    serviceInterruptionBannerService,
    serviceInterruptionBannerController,
  }
}
