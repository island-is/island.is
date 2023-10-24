import { DynamicModule, Module } from '@nestjs/common'

import { SkilavottordModule as SModule } from '@island.is/clients/skilavottord'

import { SkilavottordRepository } from './skilavottord.repository'
import { SkilavottordResolver } from './skilavottord.resolver'
import { SkilavottordService } from './skilavottord.service'

@Module({})
export class SkilavottordModule {
  static register(): DynamicModule {
    return {
      module: SkilavottordModule,
      providers: [
        SkilavottordResolver,
        SkilavottordService,
        SkilavottordRepository,
      ],
      imports: [SModule.register()],
      exports: [
        SkilavottordResolver,
        SkilavottordService,
        SkilavottordRepository,],
    }
  }
}
