import { Module } from '@nestjs/common'

import { ApplicationResolver } from './application.resolver'
import { BackendModule } from '../../../services'
@Module({
  imports: [BackendModule],
  providers: [ApplicationResolver],
})
export class ApplicationModule {}
