import { Module, forwardRef } from '@nestjs/common'

import { UserResolver } from './user.resolver'
import { AuthModule } from '../auth'

@Module({
  imports: [AuthModule],
  providers: [UserResolver],
})
export class UserModule {}
