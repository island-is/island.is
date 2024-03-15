import { mock } from 'jest-mock-extended'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import { SharedAuthModule } from '@island.is/judicial-system/auth'

import { environment } from '../../../../environments'
import { userModuleConfig } from '../user.config'
import { UserController } from '../user.controller'
import { User } from '../user.model'
import { UserService } from '../user.service'

export const createTestingUserModule = async () => {
  const userModule = await Test.createTestingModule({
    imports: [
      SharedAuthModule.register({
        jwtSecret: environment.auth.jwtSecret,
        secretToken: environment.auth.secretToken,
      }),
      ConfigModule.forRoot({ load: [userModuleConfig] }),
    ],
    controllers: [UserController],
    providers: [
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      {
        provide: getModelToken(User),
        useValue: {
          findOne: jest.fn().mockRejectedValue(new Error('Some found')),
          findAll: jest.fn().mockRejectedValue(new Error('Some found')),
          create: jest.fn().mockRejectedValue(new Error('Some found')),
          update: jest.fn().mockRejectedValue(new Error('Some found')),
          destroy: jest.fn().mockRejectedValue(new Error('Some found')),
          findByPk: jest.fn().mockRejectedValue(new Error('Some found')),
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

  const userModel = await userModule.resolve<typeof User>(getModelToken(User))

  const userService = userModule.get<UserService>(UserService)

  const userController = userModule.get<UserController>(UserController)

  userModule.close()

  return {
    userModel,
    userService,
    userController,
  }
}
