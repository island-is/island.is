import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Case } from './models/case.model'
import { CourtSession } from './models/courtSession.model'
import { CaseRepositoryService } from './services/caseRepository.service'
import { CourtSessionRepositoryService } from './services/courtSessionRepository.service'

@Module({
  imports: [SequelizeModule.forFeature([Case, CourtSession])],
  providers: [CaseRepositoryService, CourtSessionRepositoryService],
  exports: [CaseRepositoryService, CourtSessionRepositoryService],
})
export class RepositoryModule {}
