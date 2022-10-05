import { PersonalRepresentativeModule } from '@island.is/auth-api-lib'
import { Module } from '@nestjs/common'
import { RightsController } from './rights.controller'

@Module({
  imports: [PersonalRepresentativeModule],
  controllers: [RightsController],
  providers: [],
})
export class RightsModule {}
