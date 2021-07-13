import { Module } from '@nestjs/common'

import { FileResolver } from './file.resolver'

@Module({
  providers: [FileResolver],
})
export class FileModule {}
