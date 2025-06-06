import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { JwksController } from './jwks.controller'
import { KeyRegistryService } from './key-registry.service'
import { JwksConfigService } from './jwks-config.service'
import { JwtConfig } from './jwks.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [JwtConfig],
    }),
  ],
  controllers: [JwksController],
  providers: [KeyRegistryService, JwksConfigService],
  exports: [KeyRegistryService, JwksConfigService],
})
export class JwksModule {}
