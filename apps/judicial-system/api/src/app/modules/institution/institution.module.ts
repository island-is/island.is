import { Module } from '@nestjs/common'

import { InstitutionResolver } from './institution.resolver'

@Module({
  providers: [InstitutionResolver],
})
export class InstitutionModule {}
