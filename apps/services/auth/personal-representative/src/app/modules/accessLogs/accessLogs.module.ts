import { PersonalRepresentativeModule } from '@island.is/auth-api-lib'
import { Module } from '@nestjs/common'
import { AccessLogsController } from './accessLogs.controller'

@Module({
  imports: [PersonalRepresentativeModule],
  controllers: [AccessLogsController],
  providers: [],
})
export class AccessLogsModule {}
