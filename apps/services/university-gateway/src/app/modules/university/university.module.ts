import { Module } from '@nestjs/common'
import { UniversityController } from './university.controller'
import { UniversityService } from './university.service'
import { University } from './model/university'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [SequelizeModule.forFeature([University])],
  controllers: [UniversityController],
  providers: [UniversityService],
})
export class UniversityModule {}
