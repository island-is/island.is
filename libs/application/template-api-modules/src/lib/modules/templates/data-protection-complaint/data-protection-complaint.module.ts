import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
import { DataProtectionComplaintService } from './data-protection-complaint.service'
import { ClientsDataProtectionComplaintModule } from '@island.is/clients/data-protection-complaint'

const COMPLAINT_API_CLIENT_USERNAME =
  process.env.COMPLAINT_API_CLIENT_USERNAME ?? ''
const COMPLAINT_API_CLIENT_PASSWORD =
  process.env.COMPLAINT_API_CLIENT_PASSWORD ?? ''

export class DataProtectionComplaintModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: DataProtectionComplaintModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        ClientsDataProtectionComplaintModule.register({
          password: COMPLAINT_API_CLIENT_PASSWORD,
          username: COMPLAINT_API_CLIENT_USERNAME,
        }),
      ],
      providers: [DataProtectionComplaintService],
      exports: [DataProtectionComplaintService],
    }
  }
}
