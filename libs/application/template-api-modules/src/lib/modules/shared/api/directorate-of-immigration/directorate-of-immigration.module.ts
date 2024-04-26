import { DynamicModule } from '@nestjs/common'
import { DirectorateOfImmigrationService } from './directorate-of-immigration.service'
import { DirectorateOfImmigrationClientModule } from '@island.is/clients/directorate-of-immigration'
export class DirectorateOfImmigrationModule {
  static register(): DynamicModule {
    return {
      module: DirectorateOfImmigrationModule,
      imports: [DirectorateOfImmigrationClientModule],
      providers: [DirectorateOfImmigrationService],
      exports: [DirectorateOfImmigrationService],
    }
  }
}
