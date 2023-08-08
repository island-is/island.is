import { Module } from '@nestjs/common'
import { UniversityController } from './university.controller'
import { UniversityService } from './university.service'
import { ConfigModule } from '@nestjs/config'
import { University } from './model'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [
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
