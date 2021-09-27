import { Module } from '@nestjs/common'

import { ApplicationResolver } from './application.resolver'
import { AuthModule } from '@island.is/auth-nest-tools'
import { environment } from '../../../environments'

@Module({
  providers: [ApplicationResolver],
  imports: [AuthModule.register(environment.identityServerAuth)],
})
export class ApplicationModule {}
