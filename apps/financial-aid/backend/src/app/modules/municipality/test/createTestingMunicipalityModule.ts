import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LoggingModule } from '@island.is/logging'

import { MunicipalityModel } from '../models/municipality.model'
import { MunicipalityController } from '../municipality.controller'
import { MunicipalityService } from '../municipality.service'
import { AidService } from '../../aid/aid.service'
import { StaffService } from '../../staff/staff.service'
import { EmailService } from '@island.is/email-service'

jest.mock('@island.is/email-service')
jest.mock('../../aid/aid.service.ts')
jest.mock('../../staff/staff.service.ts')

export const createTestingMunicipalityModule = async () => {
  const municipalityModule = await Test.createTestingModule({
    imports: [LoggingModule],
    controllers: [MunicipalityController],
    providers: [
      AidService,
      StaffService,
      EmailService,
      {
        provide: getModelToken(MunicipalityModel),
        useValue: {
          create: jest.fn(),
          findOne: jest.fn(),
          update: jest.fn(),
        },
      },
      MunicipalityService,
    ],
  }).compile()

  const municipalitModel = await municipalityModule.resolve<
    typeof MunicipalityModel
  >(getModelToken(MunicipalityModel))

  const municipalitService = municipalityModule.get<MunicipalityService>(
    MunicipalityService,
  )

  const municipalitController = municipalityModule.get<MunicipalityController>(
    MunicipalityController,
  )

  return { municipalitModel, municipalitService, municipalitController }
}
