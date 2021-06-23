import { Module } from '@nestjs/common'

import { MunicipalityResolver } from './municipality.resolver'

@Module({
  providers: [MunicipalityResolver],
})
export class MunicipalityModule {}
