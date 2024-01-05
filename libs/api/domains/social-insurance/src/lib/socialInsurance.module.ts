import { Module } from '@nestjs/common'
import { SocialInsuranceAdministrationClientModule } from '@island.is/clients/social-insurance-administration'

@Module({
  imports: [SocialInsuranceAdministrationClientModule],
})
export class SyslumennModule {}
