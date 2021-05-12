import { Module } from '@nestjs/common'
import { EndorsementValidatorService } from './endorsementValidator.service'
import { MinAgeValidatorService } from './validators/minAge/minAgeValidator.service'
import { MinAgeByDateValidatorService } from './validators/minAgeByDate/minAgeByDateValidator.service'
import { UniqueWithinTagsValidatorService } from './validators/uniqueWithinTags/uniqueWithinTagsValidator.service'

@Module({
  providers: [
    EndorsementValidatorService,
    MinAgeValidatorService,
    MinAgeByDateValidatorService,
    UniqueWithinTagsValidatorService,
  ],
  exports: [EndorsementValidatorService],
})
export class EndorsementValidatorModule {}
