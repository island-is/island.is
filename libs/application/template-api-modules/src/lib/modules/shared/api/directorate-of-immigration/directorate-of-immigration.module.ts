import { ConfigModule } from '@nestjs/config'
import { DynamicModule } from '@nestjs/common'
import { DirectorateOfImmigrationService } from './directorate-of-immigration.service'
import {
  DirectorateOfImmigrationClientModule,
  DirectorateOfImmigrationClientConfig,
} from '@island.is/clients/directorate-of-immigration'

export class DirectorateOfImmigrationModule {
  static register(): DynamicModule {
    return {
      module: DirectorateOfImmigrationModule,
      imports: [
        DirectorateOfImmigrationClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [DirectorateOfImmigrationClientConfig],
        }),
      ],
      providers: [DirectorateOfImmigrationService],
      exports: [DirectorateOfImmigrationService],
    }
  }
}
