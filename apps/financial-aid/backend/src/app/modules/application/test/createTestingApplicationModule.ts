import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LoggingModule } from '@island.is/logging'

import { EmailService } from '@island.is/email-service'
import { ApplicationController } from '../application.controller'
import { ApplicationModel } from '../models/application.model'
import { ApplicationService } from '../application.service'
import { FileService } from '../../file/file.service'
import { AmountService } from '../../amount'
import { ApplicationEventService } from '../../applicationEvent/applicationEvent.service'
import { MunicipalityService } from '../../municipality/municipality.service'
import { StaffController } from '../../staff/staff.controller'
import { StaffModel } from '../../staff/models/staff.model'
import { StaffService } from '../../staff/staff.service'

jest.mock('@island.is/email-service')

export const createTestingApplicationModule = async () => {
  const applicationModule = await Test.createTestingModule({
    imports: [LoggingModule],
    controllers: [ApplicationController],
    providers: [
      EmailService,
      FileService,
      AmountService,
      ApplicationEventService,
      MunicipalityService,
      {
        provide: getModelToken(ApplicationModel),
        useValue: {
          create: jest.fn(),
          findOne: jest.fn(),
          update: jest.fn(),
        },
      },
      ApplicationService,
    ],
  }).compile()

  // const staffModule = await Test.createTestingModule({
  //   imports: [LoggingModule],
  //   controllers: [StaffController],
  //   providers: [
  //     EmailService,
  //     {
  //       provide: getModelToken(StaffModel),
  //       useValue: {
  //         create: jest.fn(),
  //         findOne: jest.fn(),
  //         update: jest.fn(),
  //       },
  //     },
  //     StaffService,
  //   ],
  // }).compile()

  const applicationModel = await applicationModule.resolve<
    typeof ApplicationModel
  >(getModelToken(ApplicationModel))

  const applicationService = applicationModule.get<ApplicationService>(
    ApplicationService,
  )

  // const staffService = staffModule.get<StaffService>(StaffService)

  const applicationController = applicationModule.get<ApplicationController>(
    ApplicationController,
  )

  return {
    applicationModel,
    applicationService,
    applicationController,
  }
}
