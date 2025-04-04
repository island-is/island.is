import { Module } from '@nestjs/common'
import { EducationServiceV3 } from './educationV3.service'
import { FriggClientModule } from '@island.is/clients/mms/frigg'
import { EducationV3Resolver } from './educationV3.resolver'

@Module({
  imports: [FriggClientModule],
  providers: [EducationV3Resolver, EducationServiceV3],
})
export class EducationV3Module {}
