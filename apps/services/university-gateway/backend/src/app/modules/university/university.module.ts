import { Module } from '@nestjs/common'
import { UniversityController } from './university.controller'
import { UniversityService } from './university.service'
import { ConfigModule } from '@nestjs/config'
import { University } from './model'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuditModule } from '@island.is/nest/audit'
import { environment } from '../../../environments'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    SequelizeModule.forFeature([University]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
    }),
  ],
  controllers: [UniversityController],
  providers: [UniversityService],
})
export class UniversityModule {}
