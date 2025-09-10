import { Module } from '@nestjs/common'

import { CourtSessionResolver } from './courtSession.resolver'

@Module({
  providers: [CourtSessionResolver],
})
export class CourtSessionModule {}
