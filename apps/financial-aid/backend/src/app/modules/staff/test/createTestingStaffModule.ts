import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LoggingModule } from '@island.is/logging'

import { StaffModel } from '../models'
import { StaffController } from '../staff.controller'
import { StaffService } from '../staff.service'
import { EmailService } from '@island.is/email-service'

jest.mock('@island.is/email-service')

export const createTestingStaffModule = async () => {
  const staffModule = await Test.createTestingModule({
    imports: [LoggingModule],
    controllers: [StaffController],
    providers: [
      EmailService,
      {
        provide: getModelToken(StaffModel),
        useValue: {
          create: jest.fn(),
          findOne: jest.fn(),
          findAll: jest.fn(),
          update: jest.fn(),
          count: jest.fn(),
        },
      },
      StaffService,
    ],
  }).compile()

  const staffModel = await staffModule.resolve<typeof StaffModel>(
    getModelToken(StaffModel),
  )

  const staffService = staffModule.get<StaffService>(StaffService)

  const staffController = staffModule.get<StaffController>(StaffController)

  return { staffModel, staffService, staffController }
}
