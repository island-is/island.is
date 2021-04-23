import { Module } from '@nestjs/common'
import { EndorsementValidatorService } from './endorsementValidator.service'
import { MinAgeByDateValidatorService } from './validators/minAgeByDate/minAgeByDateValidator.service'
import { UniqueWithinTagsValidatorService } from './validators/uniqueWithinTags/uniqueWithinTagsValidator.service'

@Module({
  providers: [
    EndorsementValidatorService,
    MinAgeByDateValidatorService,
    UniqueWithinTagsValidatorService,
  ],
  exports: [EndorsementValidatorService],
})
export class EndorsementValidatorModule {}
