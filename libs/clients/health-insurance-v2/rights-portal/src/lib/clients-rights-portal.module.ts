import { Module } from '@nestjs/common'
import { RightsPortalApiProvider } from './clients-rights-portal.service'

@Module({
  providers: [RightsPortalApiProvider],
  exports: [RightsPortalApiProvider],
})
export class RightsPortalClientModule {}
