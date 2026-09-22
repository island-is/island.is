import { forwardRef, Module } from '@nestjs/common'

import { EventLogModule, InstitutionModule, RepositoryModule } from '..'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [
    forwardRef(() => EventLogModule),
    forwardRef(() => InstitutionModule),
    forwardRef(() => RepositoryModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
