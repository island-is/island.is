import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CourtSessionString } from '../repository'
import { CaseModule, RepositoryModule } from '..'
import { CourtDocumentController } from './courtDocument.controller'
import { CourtDocumentService } from './courtDocument.service'
import { CourtSessionController } from './courtSession.controller'
import { CourtSessionService } from './courtSession.service'

@Module({
  imports: [
    forwardRef(() => CaseModule),
    forwardRef(() => RepositoryModule),
    SequelizeModule.forFeature([CourtSessionString]),
  ],
  controllers: [CourtSessionController, CourtDocumentController],
  providers: [CourtSessionService, CourtDocumentService],
  exports: [CourtSessionService, CourtDocumentService],
})
export class CourtSessionModule {}
