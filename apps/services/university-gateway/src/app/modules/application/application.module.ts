import { Module } from '@nestjs/common'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'
import { AuditModule } from '@island.is/nest/audit'
import { environment } from '../../../environments'

@Module({
  imports: [AuditModule.forRoot(environment.audit)],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
