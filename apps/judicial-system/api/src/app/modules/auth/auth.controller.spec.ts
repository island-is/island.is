import { mock } from 'jest-mock-extended'

import { Test, TestingModule } from '@nestjs/testing'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserService } from '../user'

describe('Auth Controller', () => {
  let controller: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        { provide: 'IslandisLogin', useValue: {} },
        { provide: LOGGER_PROVIDER, useValue: mock<Logger>() },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
