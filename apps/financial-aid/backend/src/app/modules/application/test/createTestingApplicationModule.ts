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
import { DirectTaxPaymentService } from '../../directTaxPayment'

jest.mock('@island.is/email-service')
jest.mock('../../file/file.service.ts')
jest.mock('../../staff/staff.service.ts')
jest.mock('../../directTaxPayment')
jest.mock('../../applicationEvent/applicationEvent.service.ts')
jest.mock('../../municipality/municipality.service.ts')
jest.mock('../../amount/amount.service.ts')
jest.mock('@island.is/nest/audit')
jest.mock('@island.is/email-service')

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
      DirectTaxPaymentService,
      {
        provide: getModelToken(ApplicationModel),
        useValue: {
          findOne: jest.fn(),
          count: jest.fn(),
          findAll: jest.fn(),
          update: jest.fn(),
          create: jest.fn(),
        },
      },
      ApplicationService,
    ],
  }).compile()

  const applicationModel = await applicationModule.resolve<
    typeof ApplicationModel
  >(getModelToken(ApplicationModel))

  const applicationService =
    applicationModule.get<ApplicationService>(ApplicationService)

  const applicationController = applicationModule.get<ApplicationController>(
    ApplicationController,
  )

  const fileService = applicationModule.get<FileService>(FileService)

  const directTaxPaymentService =
    applicationModule.get<DirectTaxPaymentService>(DirectTaxPaymentService)

  const staffService = applicationModule.get<StaffService>(StaffService)

  const amountService = applicationModule.get<AmountService>(AmountService)

  const applicationEventService =
    applicationModule.get<ApplicationEventService>(ApplicationEventService)

  const municipalityService =
    applicationModule.get<MunicipalityService>(MunicipalityService)

  const emailService = applicationModule.get<EmailService>(EmailService)

  return {
    applicationModel,
    applicationService,
    applicationController,
    fileService,
    staffService,
    amountService,
    applicationEventService,
    municipalityService,
    emailService,
    directTaxPaymentService,
  }
}
