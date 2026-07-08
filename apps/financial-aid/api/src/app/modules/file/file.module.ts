import { Module } from '@nestjs/common'

import { FileResolver } from './file.resolver'
import { BackendModule } from '../../../services'

@Module({
  imports: [BackendModule],
  providers: [FileResolver],
})
export class FileModule {}
