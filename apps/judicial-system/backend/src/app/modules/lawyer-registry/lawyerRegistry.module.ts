import { forwardRef, Module } from '@nestjs/common'

import { EventModule, RepositoryModule } from '..'
import { LawyerRegistryController } from './lawyerRegistry.controller'
import { LawyerRegistryService } from './lawyerRegistry.service'

@Module({
  imports: [forwardRef(() => EventModule), forwardRef(() => RepositoryModule)],
  providers: [LawyerRegistryService],
  controllers: [LawyerRegistryController],
  exports: [LawyerRegistryService],
})
export class LawyerRegistryModule {}
