import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import { ChargeFjsV2ClientConfig } from '@island.is/clients/charge-fjs-v2'
import { LoggingModule } from '@island.is/logging'

import { AuditModule } from '@island.is/nest/audit'
import { XRoadConfig } from '@island.is/nest/config'
import {
  FeatureFlagConfig,
  FeatureFlagModule,
} from '@island.is/nest/feature-flags'
import { SequelizeConfigService } from '../../sequelizeConfig.service'

import { environment } from '../../environments'
import { JwksConfig } from '../jwks/jwks.config'
import { PaymentFlowModuleConfig } from '../paymentFlow/paymentFlow.config'
import { PaymentFlowModule } from '../paymentFlow/paymentFlow.module'
import { WorkerModuleConfig } from './worker.config'
import { WorkerService } from './worker.service'

/**
 * Standalone module for the FJS backfill worker.
 *
 * Runs outside the main payments API: finds paid card flows without FJS charges,
 * creates the charges, and saves receptionId to PaymentFlow and PaymentFulfillment.
 *
 * Uses PaymentFlowService for charge creation, catalog lookup, and flow queries.
 */
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    LoggingModule,
    AuditModule.forRoot(environment.audit),
    PaymentFlowModule,
    FeatureFlagModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        XRoadConfig,
        FeatureFlagConfig,
        ChargeFjsV2ClientConfig,
        PaymentFlowModuleConfig,
        JwksConfig,
        WorkerModuleConfig,
      ],
    }),
  ],
  providers: [WorkerService],
})
export class WorkerModule {}
