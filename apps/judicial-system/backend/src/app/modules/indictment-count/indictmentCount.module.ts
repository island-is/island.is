import { forwardRef, Module } from '@nestjs/common'

import { CaseModule, RepositoryModule } from '..'
import { IndictmentCountController } from './indictmentCount.controller'
import { IndictmentCountService } from './indictmentCount.service'

@Module({
  imports: [forwardRef(() => CaseModule), forwardRef(() => RepositoryModule)],
  controllers: [IndictmentCountController],
  providers: [IndictmentCountService],
  exports: [IndictmentCountService],
})
export class IndictmentCountModule {}
