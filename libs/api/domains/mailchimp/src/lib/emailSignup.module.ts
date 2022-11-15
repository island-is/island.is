import { Module } from '@nestjs/common'
import { EmailSignupResolver } from './emailSignup.resolver'
import { CmsModule } from '@island.is/cms'

@Module({
  imports: [CmsModule],
  providers: [EmailSignupResolver],
})
export class MailchimpModule {}
