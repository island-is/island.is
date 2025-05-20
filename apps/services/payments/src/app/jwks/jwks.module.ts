import { Module } from '@nestjs/common'
import { JwksController } from './jwks.controller'
import { KeyRegistryService } from './key-registry.service'
import { JwtConfigService } from './jwt-config.service'

@Module({
  controllers: [JwksController],
  providers: [KeyRegistryService, JwtConfigService],
  exports: [KeyRegistryService, JwtConfigService],
})
export class JwksModule {}
