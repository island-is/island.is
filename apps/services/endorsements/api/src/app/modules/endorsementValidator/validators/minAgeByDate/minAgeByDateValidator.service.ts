import { Injectable } from '@nestjs/common'
import { IsDateString, IsNumber } from 'class-validator'
import { ValidatorService } from '../../endorsementValidator.service'
import { info } from 'kennitala'

export class MinAgeByDateInputType {
  @IsNumber()
  age!: number

  @IsDateString()
  date!: string
}

export interface MinAgeByDateInput {
  value: MinAgeByDateInputType
  meta: {
    nationalId: string
  }
}

@Injectable()
export class MinAgeByDateValidatorService implements ValidatorService {
  validate(input: MinAgeByDateInput) {
    const nationalIdInfo = info(input.meta.nationalId)

    const eventDate = new Date(input.value.date)
    const birthdayDate = new Date(nationalIdInfo.birthday)

    const eventYear = eventDate.getFullYear()
    const birthdayYear = birthdayDate.getFullYear()

    // if my birthday in the event year is after the event date we subtract 1 year
    birthdayDate.setFullYear(eventYear)
    const birthdayEqualizer = Number(
      birthdayDate.getTime() >= eventDate.getTime(),
    )
    let ageAtDate = eventYear - birthdayYear - birthdayEqualizer

    // as seen in https://github.com/HermannBjorgvin/Kennitala/blob/master/kennitala.js
    if (ageAtDate < 0) {
      // national registry some times registers national id with temporary last digits, we add 100 to correct negative ageAtDate outcome
      ageAtDate = ageAtDate + 100
    }

    return nationalIdInfo.valid && input.value.age <= ageAtDate
  }
}
