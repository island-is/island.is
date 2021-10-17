import { Test } from '@nestjs/testing'

import { LoggingModule } from '@island.is/logging'
import { SharedAuthModule } from '@island.is/judicial-system/auth'
import { User } from '@island.is/judicial-system/types'

import { environment } from '../../../../environments'
import { Case, CaseService } from '../../case'
import { PoliceService } from '../police.service'
import { PoliceController } from '../police.controller'

export async function createTestingPoliceModule() {
  const policeModule = await Test.createTestingModule({
    imports: [
      LoggingModule,
      SharedAuthModule.register({
        jwtSecret: environment.auth.jwtSecret,
        secretToken: environment.auth.secretToken,
      }),
    ],
    controllers: [PoliceController],
    providers: [
      {
        provide: CaseService,
        useClass: jest.fn(() => ({
          findByIdAndUser: (id: string, _: User) =>
            Promise.resolve({ id } as Case),
        })),
      },
      PoliceService,
    ],
  }).compile()

  return policeModule.get<PoliceController>(PoliceController)
}
