import { Module } from '@nestjs/common'
import { DirectorateOfImmigrationService } from './directorate-of-immigration.service'
import { DirectorateOfImmigrationClientModule } from '@island.is/clients/directorate-of-immigration'

@Module({
  imports: [DirectorateOfImmigrationClientModule],
  providers: [DirectorateOfImmigrationService],
  exports: [DirectorateOfImmigrationService],
})
export class DirectorateOfImmigrationModule {}
