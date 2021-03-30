import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { SignatureModule } from './modules/signature/signature.module'
import { SignatureListModule } from './modules/signatureList/signatureList.module'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SignatureModule,
    SignatureListModule,
  ],
})
export class AppModule {}
