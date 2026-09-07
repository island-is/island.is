import { forwardRef, Module } from '@nestjs/common'

import { CaseModule, RepositoryModule } from '..'
import { VictimController } from './victim.controller'
import { VictimService } from './victim.service'

@Module({
  imports: [forwardRef(() => CaseModule), forwardRef(() => RepositoryModule)],
  controllers: [VictimController],
  providers: [VictimService],
  exports: [VictimService],
})
export class VictimModule {}
