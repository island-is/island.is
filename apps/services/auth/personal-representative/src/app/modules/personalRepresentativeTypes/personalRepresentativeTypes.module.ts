import { PersonalRepresentativeModule } from '@island.is/auth-api-lib'
import { Module } from '@nestjs/common'
import { PersonalRepresentativeTypesController } from './personalRepresentativeTypes.controller'

@Module({
  imports: [PersonalRepresentativeModule],
  controllers: [PersonalRepresentativeTypesController],
  providers: [],
})
export class PersonalRepresentativeTypesModule {}
