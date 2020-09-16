import { Module } from '@nestjs/common'

import { RecyclingPartnerResolver } from './recyclingPartner.resolver'

@Module({
  providers: [RecyclingPartnerResolver],
})
export class RecyclingPartnerModule {}
