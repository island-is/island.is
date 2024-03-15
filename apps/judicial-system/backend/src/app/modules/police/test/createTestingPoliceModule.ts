import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule, ConfigType } from '@island.is/nest/config'

import { SharedAuthModule } from '@island.is/judicial-system/auth'

import { environment } from '../../../../environments'
import { AwsS3Service } from '../../aws-s3'
import { CaseService } from '../../case'
import { InternalCaseService } from '../../case/internalCase.service'
import { EventService } from '../../event'
import { policeModuleConfig } from '../police.config'
import { PoliceController } from '../police.controller'
import { PoliceService } from '../police.service'

jest.mock('../../event/event.service')
jest.mock('../../aws-s3/awsS3.service.ts')
jest.mock('../../case/case.service.ts')
jest.mock('../../case/internalCase.service.ts')

export const createTestingPoliceModule = async () => {
  const policeModule = await Test.createTestingModule({
    imports: [
      SharedAuthModule.register({
        jwtSecret: environment.auth.jwtSecret,
        secretToken: environment.auth.secretToken,
      }),
      ConfigModule.forRoot({ load: [policeModuleConfig] }),
    ],
    controllers: [PoliceController],
    providers: [
      EventService,
      AwsS3Service,
      CaseService,
      InternalCaseService,
      PoliceService,
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
    ],
  }).compile()

  const config = policeModule.get<ConfigType<typeof policeModuleConfig>>(
    policeModuleConfig.KEY,
  )

  const awsS3Service = policeModule.get<AwsS3Service>(AwsS3Service)

  const policeService = policeModule.get<PoliceService>(PoliceService)

  const policeController = policeModule.get<PoliceController>(PoliceController)

  policeModule.close()

  return { config, awsS3Service, policeService, policeController }
}
