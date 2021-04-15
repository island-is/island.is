import { Injectable } from '@nestjs/common'
import { MinAgeByDateValidatorService } from './validators/minAgeByDate.service'

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
}

// add new validation rules here
export enum ValidationRule {
  MIN_AGE_AT_DATE = 'minAgeAtDate',
}

@Injectable()
export class EndorsementValidatorService {
  validatorTypesMap: ValidatorTypesMap
  constructor(
    private readonly minAgeByDateValidatorService: MinAgeByDateValidatorService,
  ) {
    // we map rules to rule validators here
    this.validatorTypesMap = {
      [ValidationRule.MIN_AGE_AT_DATE]: this.minAgeByDateValidatorService,
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
}
