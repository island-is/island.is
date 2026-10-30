import { forwardRef, Module } from '@nestjs/common'

import { RepositoryModule } from '..'
import { InstitutionController } from './institution.controller'
import { InstitutionService } from './institution.service'

@Module({
  imports: [forwardRef(() => RepositoryModule)],
  controllers: [InstitutionController],
  providers: [InstitutionService],
  exports: [InstitutionService],
})
export class InstitutionModule {}
