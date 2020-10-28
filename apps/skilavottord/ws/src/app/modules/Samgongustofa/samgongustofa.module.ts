import { Module } from '@nestjs/common'

import { SamgongustofaResolver } from './samgongustofa.resolver'

@Module({
  providers: [SamgongustofaResolver],
})
export class SamgongustofaModule {}
