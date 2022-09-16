import { PersonalRepresentativeModule } from '@island.is/auth-api-lib'
import { Module } from '@nestjs/common'
import { RightTypesController } from './rightTypes.controller'

@Module({
  imports: [PersonalRepresentativeModule],
  controllers: [RightTypesController],
  providers: [],
})
export class RightTypesModule {}
