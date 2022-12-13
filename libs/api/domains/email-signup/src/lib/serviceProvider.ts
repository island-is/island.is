import { Provider } from '@nestjs/common'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { EmailSignupConfig } from './emailSignup.config'
import { EmailSignupService } from './emailSignup.service'

export const EmailSignupServiceProvider: Provider<EmailSignupService> = {
  provide: EmailSignupService,
  scope: LazyDuringDevScope,
  useFactory(config: ConfigType<typeof EmailSignupConfig>) {
    return new EmailSignupService(config)
  },
  inject: [EmailSignupConfig.KEY],
}
