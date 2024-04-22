import { DynamicModule } from '@nestjs/common'
import { InnaClientModule } from '@island.is/clients/inna'
import { InnaService } from './inna.service'
export class InnaModule {
  static register(): DynamicModule {
    return {
      module: InnaModule,
      imports: [InnaClientModule],
      providers: [InnaService],
      exports: [InnaService],
    }
  }
}
