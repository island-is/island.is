import { Injectable } from '@nestjs/common'
import { EndorsementMetaField } from '../endorsementMetadata/endorsementMetadata.service'
import { MinAgeByDateValidatorService } from './validators/minAgeByDate/minAgeByDateValidator.service'
import { UniqueWithinTagsValidatorService } from './validators/uniqueWithinTags/uniqueWithinTagsValidator.service'

type ValidatorTypesMap = {
  [key in ValidationRule]: ValidatorService
}

interface EndorsementValidatorInput {
  validations: {
    type: ValidationRule
    value?: any
  }[]

  meta: any
}

export interface ValidatorService {
  validate: (input: any) => boolean
  requiredMetaFields?: EndorsementMetaField[]
}

// add new validation rules here
export enum ValidationRule {
  MIN_AGE_AT_DATE = 'minAgeAtDate',
  UNIQUE_WITHIN_TAGS = 'uniqueWithinTags',
}

@Injectable()
export class EndorsementValidatorService {
  validatorTypesMap: ValidatorTypesMap
  constructor(
    private readonly minAgeByDateValidatorService: MinAgeByDateValidatorService,
    private readonly uniqueWithinTagsValidatorService: UniqueWithinTagsValidatorService,
  ) {
    // we map rules to rule validators here
    this.validatorTypesMap = {
      [ValidationRule.MIN_AGE_AT_DATE]: this.minAgeByDateValidatorService,
      [ValidationRule.UNIQUE_WITHIN_TAGS]: this
        .uniqueWithinTagsValidatorService,
    }
  }

  validate({ validations, meta }: EndorsementValidatorInput): boolean {
    for (let i = 0; i < validations.length; i++) {
      const { type, value } = validations[i]

      // run validation for this rule type
      const isValid = this.validatorTypesMap[type].validate({
        value,
        meta,
      })

      // if any rule is invalid we fail the validation
      if (!isValid) {
        return false
      }
    }

    // we only get here if all rules succeed
    return true
  }

  getRequiredValidationMetadataFields(
    ruleTypes: ValidationRule[],
  ): EndorsementMetaField[] {
    console.log('trying to get metadata fields')
    // we ask the requested validators what meta fields they need
    const metaFields = ruleTypes.reduce(
      (requiredMetaFields: EndorsementMetaField[], ruleType) => {
        return [
          ...requiredMetaFields,
          ...(this.validatorTypesMap[ruleType].requiredMetaFields ?? []),
        ]
      },
      [],
    )
    console.log('returning metadata fields', metaFields)
    return metaFields
  }
}
