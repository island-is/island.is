import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { CacheService } from '../cache/cache.service'
import { CacheModule } from '../cache/cache.module'
import { UserService } from './user.service'

@Module({
  imports: [CacheModule],
  controllers: [UserController],
  providers: [CacheService, UserService],
})
export class UserModule {}
