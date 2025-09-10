import { Module } from '@nestjs/common'

import { CourtDocumentResolver } from './courtDocument.resolver'
import { CourtSessionResolver } from './courtSession.resolver'

@Module({
  providers: [CourtSessionResolver, CourtDocumentResolver],
})
export class CourtSessionModule {}
