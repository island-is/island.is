import { Module } from '@nestjs/common'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'
import { ConfigModule } from '@nestjs/config'
import { AuditModule } from '@island.is/nest/audit'
import { environment } from '../../../environments'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
    }),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
