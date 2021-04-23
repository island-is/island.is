import { Injectable } from '@nestjs/common'
import { IsArray, IsEnum } from 'class-validator'
import { ValidatorService } from '../../endorsementValidator.service'
import { EndorsementTag } from '../../../endorsementList/endorsementList.model'
import { EndorsementMetaField } from '../../../endorsementMetadata/endorsementMetadata.service'

export class UniqueWithinTagsInputType {
  @IsArray()
  @IsEnum(EndorsementTag, { each: true })
  tags!: EndorsementTag[]
}

export interface UniqueWithinTagsInput {
  value: UniqueWithinTagsInputType
  meta: {
    nationalId: string
    signedTags: EndorsementTag[]
  }
}

@Injectable()
export class UniqueWithinTagsValidatorService implements ValidatorService {
  requiredMetaFields = [EndorsementMetaField.SIGNED_TAGS]
  validate (input: UniqueWithinTagsInput) {
    for (const tag of input.value.tags) {
      if (input.meta.signedTags.includes(tag)) {
        // we found existing tag, lets fail the validation
        return false
      }
    }
    // no existing tag was found, return success
    return true
  }
}
