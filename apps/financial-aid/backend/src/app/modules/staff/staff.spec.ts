import { uuid } from 'uuidv4'
import { Response } from 'express'
import each from 'jest-each'
import * as streamBuffers from 'stream-buffers'

import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'

import { EmailService } from '@island.is/email-service'

import { StaffController } from './staff.controller'
import { StaffService } from './staff.service'
import { StaffModel } from './models'
import { LoggingModule } from '@island.is/logging'

// import * as formatters from '../../formatters'
// import { CourtService } from '../court'
// import { UserService } from '../user'
// import { EventService } from '../event'
// import { FileService } from '../file'
// import { Case } from './models'
// import { CaseService } from './case.service'
// import { CaseController } from './case.controller'
// import { AwsS3Service } from '../aws-s3'

describe('StaffController', () => {
  let staffModel: { findOne: jest.Mock }
  let staffController: StaffController

  beforeEach(async () => {
    staffModel = { findOne: jest.fn() }

    const staffModule = await Test.createTestingModule({
      imports: [LoggingModule],
      controllers: [StaffController],
      providers: [
        {
          provide: StaffService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: EmailService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: getModelToken(StaffModel),
          useValue: staffModel,
        },
        StaffService,
      ],
    }).compile()

    staffController = staffModule.get<StaffController>(StaffController)
  })
})
