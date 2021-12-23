import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'
import { LoggingModule } from '@island.is/logging'

import { MunicipalityModel } from '../models/municipality.model'
import { MunicipalityController } from '../municipality.controller'
import { StaffService } from '../../staff/staff.service'
import { EmailService } from '@island.is/email-service'
import { MunicipalityService } from '../municipality.service'
import { AidService } from '../../aid/aid.service'

jest.mock('@island.is/email-service')
jest.mock('../../staff/staff.service.ts')
jest.mock('../../aid/aid.service.ts')

export const createTestingMunicipalityModule = async () => {
  const municipalityModule = await Test.createTestingModule({
    imports: [LoggingModule],
    controllers: [MunicipalityController],
    providers: [
      StaffService,
      EmailService,
      AidService,
      {
        provide: getModelToken(MunicipalityModel),
        useValue: {
          findOne: jest.fn(),
        },
      },
      MunicipalityService,
    ],
  }).compile()

  const municipalityModel = await municipalityModule.resolve<
    typeof MunicipalityModel
  >(getModelToken(MunicipalityModel))

  const municipalityService = municipalityModule.get<MunicipalityService>(
    MunicipalityService,
  )

  const municipalityController = municipalityModule.get<MunicipalityController>(
    MunicipalityController,
  )

  return { municipalityModel, municipalityController, municipalityService }
}
