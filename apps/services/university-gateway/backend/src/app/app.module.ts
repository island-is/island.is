import { Module } from '@nestjs/common'
import { ApplicationModule } from './modules/application/application.module'
import { CourseModule } from './modules/course/course.module'
import { ProgramModule } from './modules/program/program.module'
import { UniversityModule } from './modules/university/university.module'
import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    ApplicationModule,
    CourseModule,
    ProgramModule,
    UniversityModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    //TODO Gunnar skoða
    // SharedAuthModule.register({
    //   jwtSecret: environment.auth.jwtSecret,
    //   secretToken: environment.auth.secretToken,
    // }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
