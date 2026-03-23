import { Module } from '@nestjs/common'

import { FileController } from './file.controller'
import { FileResolver } from './file.resolver'
import { FileService } from './file.service'
import { LimitedAccessFileController } from './limitedAccessFile.controller'
import { LimitedAccessFileResolver } from './limitedAccessFile.resolver'
import { PoliceDigitalCaseFileResolver } from './policeDigitalCaseFile.resolver'

@Module({
  controllers: [FileController, LimitedAccessFileController],
  providers: [
    FileResolver,
    LimitedAccessFileResolver,
    PoliceDigitalCaseFileResolver,
    FileService,
  ],
})
export class FileModule {}
