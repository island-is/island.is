import { Module } from '@nestjs/common'
import { VMSTModule } from '@island.is/clients/vmst'
import { DirectorateOfLabourRepository } from './directorate-of-labour.repository'
import { DirectorateOfLabourResolver } from './directorate-of-labour.resolver'
import { DirectorateOfLabourService } from './directorate-of-labour.service'

@Module({
  providers: [
    DirectorateOfLabourResolver,
    DirectorateOfLabourService,
    DirectorateOfLabourRepository,
  ],
  imports: [VMSTModule],
})
export class DirectorateOfLabourModule {}
