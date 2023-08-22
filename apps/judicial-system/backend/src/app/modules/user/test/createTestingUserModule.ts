import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { User } from '../user.model'
import { UserService } from '../user.service'

export const createTestingUserModule = async () => {
  const userModule = await Test.createTestingModule({
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
          findOne: jest.fn(),
          findAll: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          destroy: jest.fn(),
          findByPk: jest.fn(),
        },
      },
      UserService,
    ],
  }).compile()

  const userModel = await userModule.resolve<typeof User>(getModelToken(User))

  const userService = userModule.get<UserService>(UserService)

  userModule.close()

  return {
    userModel,
    userService,
  }
}
