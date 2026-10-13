import { mock } from 'jest-mock-extended'

import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import {
  SharedAuthModule,
  sharedAuthModuleConfig,
} from '@island.is/judicial-system/auth'

import { UserRepositoryService } from '../../repository'
import { userModuleConfig } from '../user.config'
import { UserController } from '../user.controller'
import { UserService } from '../user.service'

export const createTestingUserModule = async () => {
  const userModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [sharedAuthModuleConfig, userModuleConfig],
      }),
    ],
    controllers: [UserController],
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
      {
        provide: UserRepositoryService,
        useValue: {
          findById: jest.fn().mockRejectedValue(new Error('Some error')),
          findActiveByNationalId: jest
            .fn()
            .mockRejectedValue(new Error('Some error')),
          findAllActive: jest.fn().mockRejectedValue(new Error('Some error')),
          findAllForAdmin: jest.fn().mockRejectedValue(new Error('Some error')),
          findAllActiveWhoCanConfirmIndictments: jest
            .fn()
            .mockRejectedValue(new Error('Some error')),
          findAllActiveProsecutors: jest
            .fn()
            .mockRejectedValue(new Error('Some error')),
          create: jest.fn().mockRejectedValue(new Error('Some error')),
          updateById: jest.fn().mockRejectedValue(new Error('Some error')),
        },
      },
      UserService,
    ],
  })
    .useMocker((token) => {
      if (typeof token === 'function') {
        return mock()
      }
    })
    .compile()

  const userRepositoryService = userModule.get<UserRepositoryService>(
    UserRepositoryService,
  )

  const userService = userModule.get<UserService>(UserService)

  const userController = userModule.get<UserController>(UserController)

  userModule.close()

  return {
    userRepositoryService,
    userService,
    userController,
  }
}
