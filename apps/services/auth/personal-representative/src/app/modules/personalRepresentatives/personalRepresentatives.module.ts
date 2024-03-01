import {
  DelegationsModule,
  PersonalRepresentativeModule,
} from '@island.is/auth-api-lib'
import { Module } from '@nestjs/common'
import { PersonalRepresentativesController } from './personalRepresentatives.controller'

@Module({
  imports: [PersonalRepresentativeModule, DelegationsModule],
  controllers: [PersonalRepresentativesController],
  providers: [],
})
export class PersonalRepresentativesModule {}
