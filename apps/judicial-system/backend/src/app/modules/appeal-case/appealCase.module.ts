import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AppealCase } from '../repository'
import { CaseModule, EventModule, RepositoryModule, UserModule } from '..'
import { AppealCaseController } from './appealCase.controller'
import { AppealCaseService } from './appealCase.service'
import { AppealCaseRepositoryService } from './appealCaseRepository.service'
import { LimitedAccessAppealCaseController } from './limitedAccessAppealCase.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([AppealCase]),
    forwardRef(() => CaseModule),
    forwardRef(() => UserModule),
    forwardRef(() => EventModule),
    forwardRef(() => RepositoryModule),
  ],
  controllers: [AppealCaseController, LimitedAccessAppealCaseController],
  providers: [AppealCaseService, AppealCaseRepositoryService],
  exports: [AppealCaseService],
})
export class AppealCaseModule {}
