import { DynamicModule, Module } from '@nestjs/common'
import { BullModule as NestBullModule } from '@nestjs/bull'
import { SequelizeModule } from '@nestjs/sequelize'
import { FileStorageModule } from '@island.is/file-storage'
import { createRedisCluster } from '@island.is/cache'
import { TemplateAPIModule } from '@island.is/application/template-api-modules'

import { Application } from './application.model'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'
import { FileService } from './files/file.service'
import { UploadProcessor } from './upload.processor'
import { environment } from '../../../environments'
import { SigningService, SIGNING_OPTIONS } from '@island.is/dokobit-signing'

const XROAD_BASE_PATH_WITH_ENV = process.env.XROAD_BASE_PATH_WITH_ENV ?? ''

// import { AuthModule } from '@island.is/auth-nest-tools'

let BullModule: DynamicModule

if (process.env.INIT_SCHEMA === 'true') {
  BullModule = NestBullModule.registerQueueAsync()
} else {
  const bullModuleName = 'application_system_api_bull_module'
  const redisClient = createRedisCluster({
    name: bullModuleName,
    ssl: environment.production,
    nodes: environment.redis.urls,
  })
  BullModule = NestBullModule.registerQueueAsync({
    name: 'upload',
    useFactory: () => ({
      prefix: `{${bullModuleName}}`,
      createClient: () => redisClient,
    }),
  })
}

@Module({
  imports: [
    // AuthModule.register({
    //   audience: environment.identityServer.audience,
    //   issuer: environment.identityServer.issuer,
    //   jwksUri: `${environment.identityServer.jwksUri}`,
    // }),
    TemplateAPIModule.register({
      xRoadBasePathWithEnv: XROAD_BASE_PATH_WITH_ENV,
      clientLocationOrigin: environment.clientLocationOrigin,
      emailOptions: environment.emailOptions,
      jwtSecret: environment.auth.jwtSecret,
      baseApiUrl: environment.baseApiUrl,
    }),
    SequelizeModule.forFeature([Application]),
    FileStorageModule,
    BullModule,
  ],
  controllers: [ApplicationController],
  providers: [
    ApplicationService,
    FileService,
    UploadProcessor,
    {
      provide: SIGNING_OPTIONS,
      useValue: environment.signingOptions,
    },
    SigningService,
  ],
})
export class ApplicationModule {}
