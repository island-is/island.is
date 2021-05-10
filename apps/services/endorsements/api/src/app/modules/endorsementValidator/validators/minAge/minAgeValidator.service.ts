import { Injectable } from '@nestjs/common'
import { IsNumber } from 'class-validator'
import { ValidatorService } from '../../endorsementValidator.service'
import { info } from 'kennitala'

export class MinAgeInputType {
  @IsNumber()
  age!: number
}

export interface MinAgeInput {
  value: MinAgeInputType
  meta: {
    nationalId: string
  }
}

@Injectable()
export class MinAgeValidatorService implements ValidatorService {
  validate(input: MinAgeInput) {
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0) // remove time and keep only date
    const { age, valid, birthday } = info(input.meta.nationalId)

    // if age requirement matches age and birthday is today you are not the given age until tomorrow
    if (
      input.value.age === age &&
      birthday.getDate() === currentDate.getDate() &&
      birthday.getMonth() === currentDate.getMonth()
    ) {
      return false
    }

    return valid && input.value.age <= age
  }
}
