import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { EmailService } from '@island.is/email-service'
import { LoggingModule } from '@island.is/logging'

import { StaffModel } from '../models'
import { StaffController } from '../staff.controller'
import { StaffService } from '../staff.service'

// jest.mock('@island.is/dokobit-signing')
// jest.mock('@island.is/email-service')
// jest.mock('@island.is/cms-translations')
// jest.mock('../../court/court.service.ts')
// jest.mock('../../event/event.service.ts')
// jest.mock('../../user/user.service.ts')
// jest.mock('../../file/file.service.ts')
// jest.mock('../../aws-s3/awsS3.service.ts')

export const createTestingStaffModule = async () => {
  const staffModule = await Test.createTestingModule({
    imports: [LoggingModule],
    controllers: [StaffController],
    providers: [
      EmailService,
      {
        provide: getModelToken(StaffModel),
        useValue: {
          // create: jest.fn(),
          // findOne: jest.fn(),
          // update: jest.fn(),
        },
      },
      StaffService,
    ],
  }).compile()

  const staffModel = await staffModule.resolve<StaffModel>(
    getModelToken(StaffModel),
  )

  const staffService = staffModule.get<StaffService>(StaffService)

  const staffController = staffModule.get<StaffController>(StaffController)

  return { staffModel, staffService, staffController }
}
