import { Module } from '@nestjs/common'

import { MunicipalityResolver } from './municipality.resolver'
import { BackendModule } from '../../../services'

@Module({
  imports: [BackendModule],
  providers: [MunicipalityResolver],
})
export class MunicipalityModule {}
