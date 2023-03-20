import { DynamicModule } from '@nestjs/common'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { SyslumennService } from './syslumenn.service'

export class SyslumennModule {
  static register(): DynamicModule {
    return {
      module: SyslumennModule,
      imports: [SyslumennClientModule],
      providers: [SyslumennService],
      exports: [SyslumennService],
    }
  }
}
