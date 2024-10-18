import { Module } from '@nestjs/common'
import { GradeClientProvider } from './gradeClient.provider'
import { GradeClientService } from './gradeClient.service'
import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'

@Module({
  imports: [NationalRegistryV3ClientModule],
  providers: [GradeClientProvider, GradeClientService],
  exports: [GradeClientService],
})
export class GradesClientModule {}
