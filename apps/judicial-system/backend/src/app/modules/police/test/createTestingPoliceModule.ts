import { Test } from '@nestjs/testing'

import { LoggingModule } from '@island.is/logging'
import { SharedAuthModule } from '@island.is/judicial-system/auth'

import { environment } from '../../../../environments'
import { CaseService } from '../../case'
import { PoliceService } from '../police.service'
import { PoliceController } from '../police.controller'

jest.mock('../../case/case.service.ts')

export const createTestingPoliceModule = async () => {
  const policeModule = await Test.createTestingModule({
    imports: [
      LoggingModule,
      SharedAuthModule.register({
        jwtSecret: environment.auth.jwtSecret,
        secretToken: environment.auth.secretToken,
      }),
    ],
    controllers: [PoliceController],
    providers: [CaseService, PoliceService],
  }).compile()

  return policeModule.get<PoliceController>(PoliceController)
}
