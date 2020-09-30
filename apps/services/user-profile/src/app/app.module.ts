import { Module } from '@nestjs/common'
import { UserProfileModule } from './user-profile/userProfile.module';

@Module({
  imports: [UserProfileModule]
})
export class AppModule { }
