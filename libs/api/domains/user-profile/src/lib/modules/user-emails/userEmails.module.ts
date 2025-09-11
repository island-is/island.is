import { Module } from '@nestjs/common'
import { UserEmailsService } from './userEmails.service'
import { UserEmailsResolver } from './userEmails.resolver'
import { UserProfileClientModule } from '@island.is/clients/user-profile'

@Module({
  providers: [UserEmailsService, UserEmailsResolver],
  imports: [UserProfileClientModule],
})
export class UserEmailsModule {}
