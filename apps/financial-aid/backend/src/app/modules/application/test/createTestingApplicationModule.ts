import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LoggingModule } from '@island.is/logging'

import { ApplicationModel } from '../models/application.model'
import { ApplicationService } from '../application.service'
import { ApplicationController } from '../application.controller'
import { EmailService } from '@island.is/email-service'
import { FileService } from '../../file/file.service'
import { StaffService } from '../../staff/staff.service'
import { ApplicationEventService } from '../../applicationEvent/applicationEvent.service'
import { MunicipalityService } from '../../municipality/municipality.service'
import { AmountService } from '../../amount/amount.service'
import { AuditService } from '@island.is/nest/audit'

jest.mock('@island.is/email-service')
jest.mock('../../file/file.service.ts')
jest.mock('../../staff/staff.service.ts')
jest.mock('../../applicationEvent/applicationEvent.service.ts')
jest.mock('../../municipality/municipality.service.ts')
jest.mock('../../amount/amount.service.ts')
jest.mock('@island.is/nest/audit')

export const createTestingApplicationModule = async () => {
  const applicationModule = await Test.createTestingModule({
    imports: [LoggingModule],
    controllers: [ApplicationController],
    providers: [
      EmailService,
      FileService,
      StaffService,
      ApplicationEventService,
      MunicipalityService,
      AmountService,
      AuditService,
      {
        provide: getModelToken(ApplicationModel),
        useValue: {
          findOne: jest.fn(),
          findAll: jest.fn(),
        },
      },
      ApplicationService,
    ],
  }).compile()

  const applicationModel = await applicationModule.resolve<
    typeof ApplicationModel
  >(getModelToken(ApplicationModel))

  const applicationService = applicationModule.get<ApplicationService>(
    ApplicationService,
  )

  const applicationController = applicationModule.get<ApplicationController>(
    ApplicationController,
  )

  const fileService = applicationModule.get<FileService>(FileService)

  return {
    applicationModel,
    applicationService,
    applicationController,
    fileService,
  }
}
