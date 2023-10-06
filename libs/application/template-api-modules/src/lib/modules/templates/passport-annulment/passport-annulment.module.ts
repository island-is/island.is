import { DynamicModule } from '@nestjs/common'
import { PassportAnnulmentService } from './passport-annulment.service'
import { PassportsClientModule } from '@island.is/clients/passports'

export class PassportAnnulmentModule {
  static register(): DynamicModule {
    return {
      module: PassportAnnulmentModule,
      imports: [PassportsClientModule],
      providers: [PassportAnnulmentService],
      exports: [PassportAnnulmentService],
    }
  }
}
