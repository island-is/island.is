import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { DocumentProviderModule } from './modules/document-provider/document-provider.module'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    DocumentProviderModule,
  ],
})
export class AppModule {}
