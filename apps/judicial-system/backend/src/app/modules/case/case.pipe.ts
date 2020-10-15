import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'

import { CreateCaseDto, UpdateCaseDto } from './dto'

@Injectable()
export class CaseValidationPipe implements PipeTransform {
  transform(theCase: CreateCaseDto | UpdateCaseDto) {
    // Not necessary, but here for testing
    if (!theCase.policeCaseNumber) {
      throw new BadRequestException(
        `Police case number "${theCase.policeCaseNumber}" is not valid`,
      )
    }
    if (!theCase.accusedNationalId) {
      throw new BadRequestException(
        `National id "${theCase.accusedNationalId}" is not valid`,
      )
    }

    return theCase
  }
}
