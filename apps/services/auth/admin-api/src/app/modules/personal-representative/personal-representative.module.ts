import { PersonalRepresentativeModule as AuthPersonalRepresentativeModule } from '@island.is/auth-api-lib'
import { Module } from '@nestjs/common'
import { PersonalRepresentativeController } from './personal-representative.controller'

@Module({
  imports: [AuthPersonalRepresentativeModule],
  controllers: [PersonalRepresentativeController],
  providers: [],
})
export class PersonalRepresentativeModule {}
