import { DynamicModule } from '@nestjs/common'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { PSignSubmissionService } from './p-sign-submission.service'
import { FileStorageModule } from '@island.is/file-storage'

export class PSignSubmissionModule {
  static register(): DynamicModule {
    return {
      module: PSignSubmissionModule,
      imports: [SyslumennClientModule, FileStorageModule.register({})],
      providers: [PSignSubmissionService],
      exports: [PSignSubmissionService],
    }
  }
}
