import { Module } from '@nestjs/common'
import { UniversityApplicationModule } from './modules/application/universityApplication.module'
import { CourseModule } from './modules/course/course.module'
import { ProgramModule } from './modules/program/program.module'
import { UniversityModule } from './modules/university/university.module'
import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from '../sequelizeConfig.service'
import { ConfigModule } from '@nestjs/config'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
import { ReykjavikUniversityApplicationClientConfig } from '@island.is/clients/university-application/reykjavik-university'
import { UniversityOfIcelandApplicationClientConfig } from '@island.is/clients/university-application/university-of-iceland'
import { UniversityOfAkureyriApplicationClientConfig } from '@island.is/clients/university-application/university-of-akureyri'
import { BifrostUniversityApplicationClientConfig } from '@island.is/clients/university-application/bifrost-university'
import { IcelandUniversityOfTheArtsApplicationClientConfig } from '@island.is/clients/university-application/iceland-university-of-the-arts'
import { AgriculturalUniversityOfIcelandApplicationClientConfig } from '@island.is/clients/university-application/agricultural-university-of-iceland'
import { HolarUniversityApplicationClientConfig } from '@island.is/clients/university-application/holar-university'
import { AuditModule } from '@island.is/nest/audit'
import { environment } from '../environments'
import { AuthModule } from '@island.is/auth-nest-tools'

@Module({
  imports: [
    UniversityApplicationModule,
    CourseModule,
    ProgramModule,
    UniversityModule,
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        IdsClientConfig,
        XRoadConfig,
        ReykjavikUniversityApplicationClientConfig,
        UniversityOfIcelandApplicationClientConfig,
        UniversityOfAkureyriApplicationClientConfig,
        BifrostUniversityApplicationClientConfig,
        IcelandUniversityOfTheArtsApplicationClientConfig,
        AgriculturalUniversityOfIcelandApplicationClientConfig,
        HolarUniversityApplicationClientConfig,
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
