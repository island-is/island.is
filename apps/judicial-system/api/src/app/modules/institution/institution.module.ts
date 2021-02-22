import { Module } from '@nestjs/common'

import { AuditModule } from '../audit'
import { InstitutionResolver } from './institution.resolver'

@Module({
  imports: [AuditModule],
  providers: [InstitutionResolver],
})
export class InstitutionModule {}
