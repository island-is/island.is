import { Module } from '@nestjs/common'

import { CourtSessionResolver } from './courtSession.resolver'
import { CourtSessionDocumentResolver } from './courtSessionDocument.resolver'

@Module({
  providers: [CourtSessionResolver, CourtSessionDocumentResolver],
})
export class CourtSessionModule {}
