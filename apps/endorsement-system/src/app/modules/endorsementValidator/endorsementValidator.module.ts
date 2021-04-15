import { Module } from '@nestjs/common'
import { EndorsementValidatorService } from './endorsementValidator.service'
import { MinAgeByDateValidatorService } from './validators/minAgeByDate.service'

@Module({
  providers: [EndorsementValidatorService, MinAgeByDateValidatorService],
  exports: [EndorsementValidatorService],
})
export class EndorsementValidatorModule {}
