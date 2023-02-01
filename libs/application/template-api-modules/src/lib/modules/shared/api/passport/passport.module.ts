import { DynamicModule } from '@nestjs/common'
import { PassportService } from './passport.service'
import { PassportsClientModule } from '@island.is/clients/passports'

export class PassportModule {
  static register(): DynamicModule {
    return {
      module: PassportModule,
      imports: [PassportsClientModule],
      providers: [PassportService],
      exports: [PassportService],
    }
  }
}
