import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { CreateCaseDto } from './dto/createCase.dto'
import { UpdateCaseDto } from './dto/updateCase.dto'

@Injectable()
export class CaseValidationPipe implements PipeTransform {
  constructor(private partialValidation: boolean) {}

  transform(theCase: CreateCaseDto | UpdateCaseDto) {
    // For testing purposes
    if (theCase.description === 'invalid') {
      throw new BadRequestException(
        `Csae description "${theCase.description}" is not valid`,
      )
    }

    return theCase
  }
}
