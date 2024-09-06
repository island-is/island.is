import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'
import { NewPrimarySchoolService } from './new-primary-school.service'
import { FriggClientModule } from '@island.is/clients/mms/frigg'

export class NewPrimarySchoolModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: NewPrimarySchoolModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        NationalRegistryXRoadModule,
        FriggClientModule,
      ],
      providers: [NewPrimarySchoolService],
      exports: [NewPrimarySchoolService],
    }
  }
}
