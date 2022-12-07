import { Module } from '@nestjs/common'
import { CmsModule } from '@island.is/cms'
import { EmailSignupResolver } from './emailSignup.resolver'
import { EmailSignupServiceProvider } from './serviceProvider'

@Module({
  imports: [CmsModule],
  providers: [EmailSignupServiceProvider, EmailSignupResolver],
})
export class EmailSignupModule {}
