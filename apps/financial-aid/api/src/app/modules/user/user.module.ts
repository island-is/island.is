import { Module } from '@nestjs/common'

import { UserResolver } from './user.resolver'
import { BackendModule } from '../../../services'

@Module({
  imports: [BackendModule],
  providers: [UserResolver],
})
export class UserModule {}
