import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { EventModule } from '../index'
import { LawyerRegistryController } from './lawyerRegistry.controller'
import { LawyerRegistry } from './lawyerRegistry.model'
import { LawyerRegistryService } from './lawyerRegistry.service'

@Module({
  imports: [
    forwardRef(() => EventModule),
    SequelizeModule.forFeature([LawyerRegistry]),
  ],
  providers: [LawyerRegistryService],
  controllers: [LawyerRegistryController],
  exports: [LawyerRegistryService],
})
export class LawyerRegistryModule {}
