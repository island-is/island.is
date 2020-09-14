import { mock } from 'jest-mock-extended'

import { Test, TestingModule } from '@nestjs/testing'

import { LOGGER_PROVIDER, Logger } from '@island.is/logging'

import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserRole } from './user.types'

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

  it('should get user', async () => {
    const user = await controller.getCurrentUser({
      user: { nationalId: '2510654469' },
    })

    expect(user).toBeDefined()
    expect(user.nationalId).toBe('2510654469')
    expect(user.roles).toBeDefined()
    expect(user.roles.length).toBe(2)
    expect(user.roles).toContain(UserRole.PROCECUTOR)
    expect(user.roles).toContain(UserRole.JUDGE)
  })
})
