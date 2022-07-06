import { Module } from '@nestjs/common'
import { UserProfileApi } from '../../gen/fetch'

import { UserProfileApiProvider } from './apiConfiguration'

@Module({
  providers: [UserProfileApiProvider],
  exports: [UserProfileApi],
})
export class UserProfileClientModule {}
