import { DynamicModule } from '@nestjs/common'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { PSignSubmissionService } from './p-sign-submission.service'

export class PSignSubmissionModule {
  static register(): DynamicModule {
    return {
      module: PSignSubmissionModule,
      imports: [SyslumennClientModule],
      providers: [PSignSubmissionService],
      exports: [PSignSubmissionService],
    }
  }
}
