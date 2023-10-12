import { Test } from '@nestjs/testing'

import { FileService } from '../../file/file.service'
import { PersonalTaxReturnController } from '../personalTaxReturn.controller'
import { PersonalTaxReturnService } from '../personalTaxReturn.service'
import { PersonalTaxReturnApi } from '@island.is/clients/rsk/personal-tax-return'
import { LoggingModule } from '@island.is/logging'

jest.mock('@island.is/clients/rsk/personal-tax-return')
jest.mock('../../file/file.service')

export const createTestingPersonalTaxReturnModule = async () => {
  const personalTaxReturnModule = await Test.createTestingModule({
    imports: [LoggingModule],
    controllers: [PersonalTaxReturnController],
    providers: [PersonalTaxReturnService, FileService, PersonalTaxReturnApi],
  }).compile()

  const personalTaxReturnService =
    personalTaxReturnModule.get<PersonalTaxReturnService>(
      PersonalTaxReturnService,
    )

  const personalTaxReturnController =
    personalTaxReturnModule.get<PersonalTaxReturnController>(
      PersonalTaxReturnController,
    )

  const fileService = personalTaxReturnModule.get<FileService>(FileService)

  const personalTaxReturnApi =
    personalTaxReturnModule.get<PersonalTaxReturnApi>(PersonalTaxReturnApi)

  return {
    personalTaxReturnApi,
    personalTaxReturnController,
    personalTaxReturnService,
    fileService,
  }
}
