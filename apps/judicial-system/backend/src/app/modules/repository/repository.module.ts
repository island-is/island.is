import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Case } from './models/case.model'
import { CaseRepositoryService } from './services/caseRepository.service'

@Module({
  imports: [SequelizeModule.forFeature([Case])],
  providers: [CaseRepositoryService],
  exports: [CaseRepositoryService],
})
export class RepositoryModule {}
