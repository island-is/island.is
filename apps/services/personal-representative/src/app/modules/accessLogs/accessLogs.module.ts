import { AccessLogsController } from './accessLogs.controller'
import { Module } from '@nestjs/common'
import {
  PersonalRepresentativeAccess,
  PersonalRepresentativeAccessService,
} from '@island.is/auth-api-lib/personal-representative'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [SequelizeModule.forFeature([PersonalRepresentativeAccess])],
  controllers: [AccessLogsController],
  providers: [PersonalRepresentativeAccessService],
})
export class AccessLogsModule {}
