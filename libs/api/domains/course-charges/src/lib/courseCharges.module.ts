import { Module } from '@nestjs/common'
import { CmsModule } from '@island.is/cms'
import { ChargeFjsV2ClientModule } from '@island.is/clients/charge-fjs-v2'

import { CourseChargesResolver } from './courseCharges.resolver'
import { CourseChargesService } from './courseCharges.service'

@Module({
  imports: [CmsModule, ChargeFjsV2ClientModule],
  providers: [CourseChargesResolver, CourseChargesService],
})
export class CourseChargesModule {}
