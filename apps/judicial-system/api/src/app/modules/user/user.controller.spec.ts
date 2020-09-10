import { mock } from 'jest-mock-extended'

import { Test, TestingModule } from '@nestjs/testing'

import { LOGGER_PROVIDER, Logger } from '@island.is/logging'

import { UserController } from './user.controller'
import { UserService } from './user.service'

describe('User Controller', () => {
  let controller: UserController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        { provide: LOGGER_PROVIDER, useValue: mock<Logger>() },
      ],
    }).compile()

    controller = module.get<UserController>(UserController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
