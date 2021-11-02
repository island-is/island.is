import { Test } from '@nestjs/testing'

import { LoggingModule } from '@island.is/logging'
import { SharedAuthModule } from '@island.is/judicial-system/auth'

import { environment } from '../../../../environments'
import { AwsS3Service } from '../../aws-s3'
import { CaseService } from '../../case'
import { PoliceService } from '../police.service'
import { PoliceController } from '../police.controller'

jest.mock('../../aws-s3/awsS3.service.ts')
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
    providers: [AwsS3Service, CaseService, PoliceService],
  }).compile()

  const awsS3Service = policeModule.get<AwsS3Service>(AwsS3Service)

  const policeController = policeModule.get<PoliceController>(PoliceController)

  return { awsS3Service, policeController }
}
