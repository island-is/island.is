import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'
import { LoggingModule } from '@island.is/logging'

import { MunicipalityModel } from '../models/municipality.model'
import { MunicipalityController } from '../municipality.controller'
import { StaffService } from '../../staff/staff.service'
import { MunicipalityService } from '../municipality.service'
import { AidService } from '../../aid/aid.service'
import { Sequelize } from 'sequelize'
import { StaffModel } from '../../staff/models/staff.model'

// const Sequelize = jest.mock('sequelize', () => {
//   const mSequelize = {
//     authenticate: jest.fn(),
//     define: jest.fn(),
//     transaction: jest.fn(),
//     provide: jest.fn(),
//     useValue: jest.fn(),
//     useExisiting: jest.fn(),
//   }
//   const actualSequelize = jest.requireActual('sequelize')

//   return {
//     Sequelize: jest.fn(() => mSequelize),
//     DataTypes: actualSequelize.DataTypes,
//   }
// })

jest.mock('../../aid/aid.service.ts')
// jest.mock('@nestjs/sequelize', () => {
//   const modelToken = jest.requireActual('@nestjs/sequelize')
//   return {
//     getModelToken: modelToken.getModelToken(),
//     InjectModel: jest.fn(),
//   }
// })
jest.mock('../../staff/staff.service.ts')

export const createTestingMunicipalityModule = async () => {
  const municipalityModule = await Test.createTestingModule({
    imports: [LoggingModule],
    controllers: [MunicipalityController],
    providers: [
      StaffService,
      AidService,
      Sequelize,
      {
        provide: getModelToken(MunicipalityModel),
        useValue: {
          create: jest.fn(),
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
