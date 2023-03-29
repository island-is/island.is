import { Module } from '@nestjs/common'
import { RegulationsAdminClientService } from './RegulationsAdminClientService'

@Module({
  providers: [RegulationsAdminClientService],
  exports: [RegulationsAdminClientService],
})
export class RegulationsAdminClientModule {}
