import { Module } from '@nestjs/common'
import { UniversityController } from './university.controller'
import { UniversityService } from './university.service'
import { University } from './model/university'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuditModule } from '@island.is/nest/audit'
import { environment } from '../../../environments'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    SequelizeModule.forFeature([University]),
  ],
  controllers: [UniversityController],
  providers: [UniversityService],
})
export class UniversityModule {}
