import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  LawyersModule,
  lawyersModuleConfig,
} from '@island.is/judicial-system/lawyers'

import { EventModule } from '../index'
import { LawyerRegistryController } from './lawyerRegistry.controller'
import { LawyerRegistry } from './lawyerRegistry.model'
import { LawyerRegistryService } from './lawyerRegistry.service'

@Module({
  imports: [
    LawyersModule,
    forwardRef(() => EventModule),
    SequelizeModule.forFeature([LawyerRegistry]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [lawyersModuleConfig],
    }),
  ],
  providers: [LawyerRegistryService],
  controllers: [LawyerRegistryController],
  exports: [LawyerRegistryService],
})
export class LawyerRegistryModule {}
